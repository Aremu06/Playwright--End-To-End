# Logging

This application uses a custom logging system built with [winston][1] for efficient tracking and debugging. Logs are
managed by the `LoggerFactory`, which configures loggers for different parts of the application. By default, loggers are
set to the **warning** level.

To use the logger, import `LoggerFactory` and create a logger instance:

```typescript
import LoggerFactory from './src/core/logger/logger.factory.ts';

const logger = LoggerFactory.createLogger('ModuleName');
logger.info("Your log message", { additional: "data" });
```


## Log Files

Logs are automatically saved to two files:

- `logs/debug.log`: Contains all logs at the **debug** level and above.
- `logs/error.log`: Contains all logs at the **error** level and above.


## Changing Log Levels

To adjust the log level for console output, set the `LOG_LEVEL` environment variable when running your application. For
example, to enable **info** level logs:

```bash
LOG_LEVEL=info make test
```

This is particularly useful for detailed debugging during development or troubleshooting. The default log level is
**warning**, which captures warnings and errors.
