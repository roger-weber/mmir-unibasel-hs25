 
// ANSI escape code constants
const ANSI_CODES = {
    // Text formatting
    RESET: '\x1b[0m',
    BOLD: '\x1b[1m',
    DIM: '\x1b[2m',
    
    // Text colors
    BLUE_TEXT: '\x1b[34m',
    WHITE_TEXT: '\x1b[37m',

    // Background colors
    RED_BG: '\x1b[41m',
    YELLOW_BG: '\x1b[43m',
}


const STYLES = {
    log: {
        linePrefix: '',
        prefix: ANSI_CODES.BLUE_TEXT + ANSI_CODES.BOLD,
        suffix: ANSI_CODES.RESET,
        indent: '',
    },
    info: {
        linePrefix: '',
        prefix: '',
        suffix: '',
        indent: '  ',
    },
    debug: {
        linePrefix: '',
        prefix: ANSI_CODES.DIM,
        suffix: ANSI_CODES.RESET,
        indent: '    ',
    },
    error: {
        linePrefix: ANSI_CODES.RED_BG + ANSI_CODES.WHITE_TEXT,
        prefix: '',
        suffix: ANSI_CODES.RESET,
        indent: '',
    },
    warn: {
        linePrefix: ANSI_CODES.YELLOW_BG,
        prefix: '',
        suffix: ANSI_CODES.RESET,
        indent: '',
    }

}

const START_TIME = Date.now()


// Logger class for handling logging functionality
class Logger {
    constructor() {
        this.config = {
            silent: false,       // When true, suppresses all output except errors
            info: true,          // When true, shows info messages
            debug: true,         // When true, shows debug messages
            warning: true,       // When true, shows warning messages
            styles: true,        // When true, enables styling (colors, bold, etc.)
        };
    }

    /**
     * Configure logger settings
     * 
     * @param {...string} args - Configuration options as object or string flags
     *                                    String flags: silent/noSilent, info/noInfo, debug/noDebug,
     *                                    warning/noWarning, styles/noStyles
     * @returns {Logger} - Returns this instance for chaining
     * @throws {Error} If an invalid flag is provided
     */
    setConfig(...args) {
        const validFlags = Object.keys(this.config)
        
        for (const arg of args) {
            if (typeof arg === 'string') {
                const flag = arg.toLowerCase();
                if(validFlags.includes(flag)) {
                    this.config[flag] = true;
                } else {
                    const key = flag.slice(2);
                    if (flag.startsWith('no') && validFlags.includes(key)) {
                        this.config[key] = false;
                    } else {
                        throw new Error(`Invalid configuration key: ${flag}`);
                    }
                }
            } else {
                throw new Error(`Invalid argument type: ${typeof arg}`);
            }
        }
        return this;
    }

    /**
     * Generate timestamp for log entries showing time since program start
     */
    timestamp() {
        const elapsed = Date.now() - START_TIME;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = ((elapsed % 60000) / 1000).toFixed(3);
        return `${minutes.toString().padStart(3,' ')}:${seconds.padStart(6, '0')}`;
    }

    

    /**
     * Formats an error object into a readable array of strings
     * 
     * @param {Error} error - The error object to format
     * @returns {string[]} Array of formatted error message lines
     * 
     * The first line contains the error name and message
     * If a stack trace exists, it is included with:
     * - 'Stack trace:' header
     * - Each stack frame on its own indented line
     * - Leading 'at' removed and spacing normalized
     */
    formatError(error) {
        let output = [error.name + ': ' + error.message];
        
        if (error.stack) {
            // Split stack trace into lines and remove first line (duplicates error message)
            const stackLines = error.stack.split('\n').slice(1);
            
            // Add indented stack trace
            output.push('Stack trace:');
            stackLines.forEach(line => {
                // Clean up stack trace line and indent
                const cleanLine = line.trim()
                    .replace(/^at /, '')  // Remove leading "at"
                    .replace(/\s+\(/, ' (');  // Clean up spacing
                output.push('    ' + cleanLine);
            });
        }
        return output;
    }    

    /**
     * Internal method to log stylized messages
     * 
     * @param {string[]} lines - Array of message lines to log
     * @param {string} type - Type of log message (e.g. 'INFO', 'ERROR')
     * @param {Object} style - Style configuration object
     * @param {string} style.linePrefix - Prefix to add before each line
     * @param {string} style.prefix - Prefix to add after timestamp/type
     * @param {string} style.suffix - Suffix to add at end of each line
     * @param {string} style.indent - Indentation to add after prefix
     * @returns {void}
     */
    _stylized_log(messages, type, style) {
        if (!messages || messages.length == 0) return
        if (!this.config.styles) style = {linePrefix:'', prefix: '', suffix: '', indent: style.indent}

        const lines = messages.map(message => {
            if (message instanceof Error) return this.formatError(message).join('\n');
            if (typeof message === 'object') return JSON.stringify(message, null, 2);
            return message?.toString ? message.toString() : '';
        }).join(' ').split('\n')
        const firstPrefix = `${this.timestamp()} [${type.padEnd(5)}] ${style.indent}`
        const nextPrefix = ' '.repeat(firstPrefix.length);
        console.log(`${style.linePrefix}${firstPrefix}${style.prefix}${lines[0]}${style.suffix}`);
        for (let i = 1; i < lines.length; i++)
            console.log(`${style.linePrefix}${nextPrefix}${style.prefix}${lines[i]}${style.suffix}`);
    }

    /**
     * Log a message
     * 
     * @param {string} message - The message to log
     */
    log(...messages) {
        if (this.config.silent) return;
        this._stylized_log(messages, "LOG", STYLES['log'])
    }

    /**
     * Log a info message
     * 
     * @param {string} message - The message to log
     */
    info(...messages) {
        if (this.config.silent || !this.config.info) return;
        this._stylized_log(messages, "INFO", STYLES['info'])
    }

    /**
     * Log a debug message
     * 
     * @param {string} message - The message to log
     */
    debug(...messages) {
        if (this.config.silent || !this.config.debug) return;
        this._stylized_log(messages, "DEBUG", STYLES['debug'])
    }
    
    /**
     * Log an error message
     * 
     * @param {string|Error} message - The error message or Error object to log
     */
    error(...messages) {
        this._stylized_log(messages, "ERROR", STYLES['error'])
    }

    /**
     * Log a warning message
     * 
     * @param {string|Error} message - The error message or Error object to log
     */
    warn(...messages) {
        if (this.config.silent || !this.config.warning) return;
        this._stylized_log(messages, "WARN", STYLES['warn'])
    }
}


// Create default logger instance
const logger = new Logger();

// Export both the class and default instance
export {logger};

