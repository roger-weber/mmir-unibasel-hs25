/**
 * A specialized event queue implementation for AWS Bedrock bidirectional streaming.
 * Allows for enqueueing streaming events and consuming them asynchronously using for-await-of loops.
 * Designed to handle the bidirectional communication flow between client and Bedrock service.
 * 
 * ## Stream Closing
 * - Producers should check the `closed` property before attempting to enqueue events
 * - Consumers using for-await-of loops will automatically exit when the stream closes
 * - Consumers can also implement explicit handling for stream closure by checking the `done` property
 *   in the iterator result
 * 
 * ### Producer Example:
 * ```javascript
 * function produceEvents(queue) {
 *   const sendEvent = () => {
 *     if (queue.closed) {
 *       console.log("Queue closed, stopping producer");
 *       return; // Exit if queue is closed
 *     }
 *     
 *     try {
 *       queue.enqueue({ message: "New event" });
 *       setTimeout(sendEvent, 1000);
 *     } catch (error) {
 *       console.error("Failed to enqueue event:", error);
 *     }
 *   };
 *   
 *   sendEvent();
 * }
 * ```
 * 
 * ### Consumer Example:
 * ```javascript
 * async function consumeEvents(queue) {
 *   try {
 *     for await (const event of queue) {
 *       // Process event
 *       console.log("Received event:", event);
 *     }
 *     console.log("Stream closed, consumer exiting");
 *   } catch (error) {
 *     console.error("Error consuming events:", error);
 *   }
 * }
 * ```
 * 
 * ### Manual Iterator Example:
 * ```javascript
 * async function manualConsume(queue) {
 *   const iterator = queue[Symbol.asyncIterator]();
 *   
 *   while (true) {
 *     const { value, done } = await iterator.next();
 *     
 *     if (done) {
 *       console.log("Stream closed");
 *       break;
 *     }
 *     
 *     // Process event
 *     console.log("Received event:", value);
 *   }
 * }
 * ```
 */
export class EventQueue {
    /**
     * Creates a new BedrockStreamEventQueue instance for handling streaming events
     */
    constructor(serializer) {
        // Array to store queued streaming events
        this.queue = [];
        // Array of resolve functions for pending next() calls
        this.resolvers = [];
        // Flag indicating if event queue is closed
        this.closed = false;
        // serializer to turn payload to event structure
        this.serializer = serializer
        // observer for enqueue/dequeue events
        this.observers = []
    }

    /**
     * Adds an observer function to be called on queue events
     * @param {Function} observer - Function to call with (eventType, data)
     *   eventType can be: "enqueue", "dequeue", or "close"
     */
    addObserver(observer) {
        this.observers.push(observer);
    }

    /**
     * Removes an observer function from the queue
     * @param {Function} observer - Observer function to remove
     */
    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
        
    /**
     * Adds a streaming event to the queue
     * @param {*} event - The streaming event to enqueue
     * @throws {Error} If the event queue is closed
     */
    enqueue(event) {
        if (this.closed)
            throw new Error("Cannot enqueue to a closed event queue.");

        // invoke observers for enqueue
        this.observers.forEach(observer => observer("enqueue", event))

        if (this.resolvers.length > 0) {
            // If there are pending next() calls, resolve the first one
            const resolve = this.resolvers.shift();
            resolve({ value: event, done: false });
        } else {
            // Otherwise add to queue
            this.queue.push(event);
        }
    }

    /**
     * Closes the event queue. No more events can be enqueued after closing.
     * Resolves any pending next() calls with done:true
     */
    close() {
        if (this.closed) return
        // invoke observers for close
        this.observers.forEach(observer => observer("close", undefined))
        this.closed = true;
        while (this.resolvers.length > 0) {
            const resolve = this.resolvers.shift();
            resolve({ value: undefined, done: true });
        }
    }

    /**
     * Makes the event queue iterable with for-await-of for processing streaming events
     * @returns {AsyncIterator} An async iterator for the event queue
     */
    [Symbol.asyncIterator]() {
        return {
            next: () => {
                return new Promise((resolve) => {
                    if (this.queue.length > 0) {
                        const event = this.queue.shift()
                        // invoke observers
                        this.observers.forEach(observer => observer("dequeue", event))
                        // Return and remove first event if queue has items
                        resolve({ value: this.serializer(event), done: false });
                    } else if (this.closed) {
                        // Return done:true if queue is empty and closed
                        resolve({ value: undefined, done: true });
                    } else {
                        // Otherwise queue the resolver to be called when an event is enqueued
                        this.resolvers.push(resolve);
                    }
                });
            }
        };
    }
}

/**
 * Serializes input data into the format required for Bedrock streaming input
 * by converting the data to JSON and encoding as bytes
 * @param {*} data - The input data to serialize
 * @returns {Object} Formatted object with encoded bytes
 */
function inputStreamSerializer(data) {
    return {
        chunk: {
            bytes: new TextEncoder().encode(JSON.stringify(data))
        }
    }
}

/**
 * Serializer for output stream data that passes through data unchanged
 * @param {*} data - The output data to serialize
 * @returns {*} The unmodified data
 */
function outputStreamSerializer(data) {
    return data
}

/**
 * Event queue specialized for handling input stream events
 * Uses inputStreamSerializer to format events for Bedrock input
 */
export class InputEventQueue extends EventQueue {
    constructor() {
        super(inputStreamSerializer);
    }
}

/**
 * Event queue specialized for handling output stream events
 * Uses outputStreamSerializer to pass through events unchanged
 */
export class OutputEventQueue extends EventQueue {
    constructor() {
        super(outputStreamSerializer);
    }
}
