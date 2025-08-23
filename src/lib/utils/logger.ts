type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
}

class Logger {
  private config: LoggerConfig

  constructor(config: LoggerConfig = { level: 'info', enableConsole: true }) {
    this.config = config
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    }
    return levels[level] <= levels[this.config.level]
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    
    if (data) {
      return `${prefix} ${message} ${JSON.stringify(data)}`
    }
    return `${prefix} ${message}`
  }

  error(message: string, data?: unknown): void {
    if (this.shouldLog('error')) {
      const formattedMessage = this.formatMessage('error', message, data)
      if (this.config.enableConsole) {
        console.error(formattedMessage)
      }
      // In production, you might want to send this to a logging service
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog('warn')) {
      const formattedMessage = this.formatMessage('warn', message, data)
      if (this.config.enableConsole) {
        console.warn(formattedMessage)
      }
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      const formattedMessage = this.formatMessage('info', message, data)
      if (this.config.enableConsole) {
        console.info(formattedMessage)
      }
    }
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      const formattedMessage = this.formatMessage('debug', message, data)
      if (this.config.enableConsole) {
        console.debug(formattedMessage)
      }
    }
  }
}

// Create logger instance based on environment
const logLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'info'
const enableConsole = process.env.NODE_ENV !== 'test'

export const logger = new Logger({
  level: logLevel as LogLevel,
  enableConsole,
})

export default logger
