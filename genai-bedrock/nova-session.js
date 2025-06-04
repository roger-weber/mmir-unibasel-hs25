import { randomUUID } from "node:crypto";
import { InputEventQueue, OutputEventQueue } from '../../../../lib/javascript/event-queue';
import { BedrockRuntime, InvokeModelWithBidirectionalStreamCommand } from "@aws-sdk/client-bedrock-runtime";

export class NovaSession {
    constructor(bedrockClient) {
        this.bedrockClient = bedrockClient;
        this.inputEvents = new InputEventQueue();
        this.outputEvents = new OutputEventQueue();
        this.systemPrompt = null;
        this.active = false;
        this.promptName = `prompt-${randomUUID()}`;
        this.inferenceConfig = {
            maxTokens: 1024,
            topP: 0.9,
            temperature: 0.7,
        };
        this.audioOutputConfiguration = {
            sampleRateHertz: 24000,
            voiceId: "tiffany",
        };
        this.tools = [];
        this.logger = null;
    }

    enableDebugLogging(logger) {
        this.logger = logger;
        logger('enabling logging');
        if (!this.inputEventLogger) {
            this.inputEventLogger = (event, data) => (logger(`${event} input event with payload ${JSON.stringify(data, null, 2)}`));
            this.inputEvents.addObserver(this.inputEventLogger);
        }
        if (!this.outputEventLogger) {
            this.outputEventLogger = (event, data) => (logger(`${event} output event with payload ${JSON.stringify(data, null, 2)}`));
            this.outputEvents.addObserver(this.outputEventLogger);
        }
    }

    disableDebugLogging() {
        if (this.inputEventLogger) {
            this.inputEvents.removeObserver(this.inputEventLogger);
        }
        if (this.outputEventLogger) {
            this.outputEvents.removeObserver(this.outputEventLogger);
        }
        this.logger = null;
    }

    setSystemPrompt(systemPrompt) {
        this.systemPrompt = systemPrompt;
        return this;
    }

    setInferenceConfig(config) {
        Object.assign(this.inferenceConfig, config);
    }

    setAudioOutput(config) {
        Object.assign(this.audioOutputConfiguration, config);
    }

    addTools(tools) {
        this.tools = this.tools.concat(tools);
        return this;
    }

    addTool(tool) {
        this.tools.push(tool);
        return this;
    }

    sendText(role, text) {
        this._sendText(role, text);
    }

    _startSession() {
        let event = {
            event: {
                sessionStart: {
                    inferenceConfiguration: this.inferenceConfig
                }
            }
        };
        this.inputEvents.enqueue(event);
    }

    _startPrompt() {
        let event = {
            event: {
                promptStart: {
                    promptName: this.promptName,
                    textOutputConfiguration: {
                        mediaType: "text/plain"
                    },
                    audioOutputConfiguration: {
                        mediaType: "audio/lpcm",
                        sampleRateHert: this.audioOutputConfiguration.sampleRateHertz,
                        sampleSizeBits: 16,
                        channelCount: 1,
                        voiceId: this.audioOutputConfiguration.voiceId,
                        encoding: "base64",
                        audioType: "SPEECH",
                    },
                    toolUseOutputConfiguration: {
                        mediaType: "application/json"
                    },
                    toolConfiguration: {
                        tools: this.tools
                    }
                }
            }
        };
        this.inputEvents.enqueue(event);
    }

    _sendText(role, text) {
        let contentName = 'content-' + randomUUID();
        let eventStart = {
            event: {
                contentStart: {
                    promptName: this.promptName,
                    contentName: contentName,
                    role: role
                }
            }
        };
        this.inputEvents.enqueue(eventStart);

        let eventContent = {
            event: {
                textInput: {
                    promptName: this.promptName,
                    contentName: contentName,
                    content: text
                }
            }
        };
        this.inputEvents.enqueue(eventContent);

        let eventEnd = {
            event: {
                contentEnd: {
                    promptName: this.promptName,
                    contentName: contentName,
                }
            }
        };
        this.inputEvents.enqueue(eventEnd);
    }

    _endPrompt() {
        let event = {
            event: {
                promptEnd: {
                    promptName: this.promptName
                }
            }
        };
        this.inputEvents.enqueue(event);
    }

    _endSession() {
        let event = {
            event: {
                sessionEnd: {}
            }
        };
        this.inputEvents.enqueue(event);
    }

    async _processEvents(response) {
        if(!response.body) return
        for await (const chunk of response.body) {
            if (chunk.chunk?.bytes) {
                let text = new TextDecoder("utf-8").decode(chunk.chunk.bytes);
                let event = JSON.parse(text);
                this.outputEvents.enqueue(event);
            }
        }
    }

    async start() {
        console.log("start")
        if (this.active)
            throw new Error("Session already started");
        this.active = true;
        this._startSession();
        this._startPrompt();
        if (this.systemPrompt)
            this._sendText("SYSTEM", this.systemPrompt);
        
        console.log("call")
        const response = await this.bedrockClient.send(
            new InvokeModelWithBidirectionalStreamCommand({
                modelId: "amazon.nova-sonic-v1:0",
                body: this.inputEvents,
            })
        );
        console.log("jjjj")
        console.log(response)
        this._processEvents(response).catch(err => {
            this.stop();
        });
    }

    async stop() {
        if (!this.active) return;
        this._endPrompt();
        this._endSession();
        // close event queues
        await this.inputEvents.close()
        await this.outputEvents.close();
        this.active = false;
    }

    [Symbol.asyncIterator]() {
        return this.outputEvents[Symbol.asyncIterator]();
    }
}