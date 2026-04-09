type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private userId?: string;
  private requestId?: string;

  setUserId(userId: string) {
    this.userId = userId;
  }

  setRequestId(requestId: string) {
    this.requestId = requestId;
  }

  private createLogEntry(level: LogLevel, message: string, metadata?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      requestId: this.requestId,
      metadata,
    };
  }

  private log(entry: LogEntry) {
    if (this.isDevelopment) {
      const logMethod = entry.level === 'error' ? 'error' : 
                       entry.level === 'warn' ? 'warn' : 
                       entry.level === 'info' ? 'info' : 'debug';
      
      console[logMethod](`[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`, {
        userId: entry.userId,
        requestId: entry.requestId,
        ...entry.metadata,
      });
    } else {
      // In production, send to logging service
      this.sendToLogService(entry);
    }
  }

  private async sendToLogService(entry: LogEntry) {
    try {
      // This would integrate with your logging service (e.g., Sentry, LogRocket, etc.)
      // For now, we'll just use console in production
      console.log(JSON.stringify(entry));
      
      // Example integration with monitoring service:
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'log_event', {
          event_category: 'application_log',
          event_label: entry.level,
          value: 1,
        });
      }
    } catch (error) {
      console.error('Failed to send log to service:', error);
    }
  }

  error(message: string, metadata?: Record<string, any>) {
    this.log(this.createLogEntry('error', message, metadata));
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log(this.createLogEntry('warn', message, metadata));
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log(this.createLogEntry('info', message, metadata));
  }

  debug(message: string, metadata?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log(this.createLogEntry('debug', message, metadata));
    }
  }

  // Security-specific logging
  security(message: string, metadata?: Record<string, any>) {
    const securityMetadata = {
      ...metadata,
      category: 'security',
      timestamp: new Date().toISOString(),
    };
    this.log(this.createLogEntry('warn', `SECURITY: ${message}`, securityMetadata));
  }

  // API logging
  api(method: string, url: string, status: number, duration?: number, metadata?: Record<string, any>) {
    this.log(this.createLogEntry('info', `${method} ${url} - ${status}`, {
      ...metadata,
      method,
      url,
      status,
      duration,
      category: 'api',
    }));
  }

  // Database logging
  database(operation: string, table: string, duration?: number, metadata?: Record<string, any>) {
    this.log(this.createLogEntry('debug', `DB: ${operation} on ${table}`, {
      ...metadata,
      operation,
      table,
      duration,
      category: 'database',
    }));
  }

  // Performance logging
  performance(metric: string, value: number, metadata?: Record<string, any>) {
    this.log(this.createLogEntry('info', `PERF: ${metric} = ${value}ms`, {
      ...metadata,
      metric,
      value,
      category: 'performance',
    }));
  }
}

export const logger = new Logger();

// Helper for creating request-specific loggers
export function createRequestLogger(requestId: string, userId?: string) {
  const requestLogger = new Logger();
  requestLogger.setRequestId(requestId);
  if (userId) {
    requestLogger.setUserId(userId);
  }
  return requestLogger;
}

// Performance monitoring helper
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      logger.performance(name, duration, metadata);
      resolve(result);
    } catch (error) {
      const duration = performance.now() - start;
      logger.performance(`${name} (failed)`, duration, { ...metadata, error: String(error) });
      reject(error);
    }
  });
}
