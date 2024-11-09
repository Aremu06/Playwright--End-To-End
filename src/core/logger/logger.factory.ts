import * as winston from "winston";

class LoggerFactory {
  static createLogger(name: string) {
    const level = process.env.LOG_LEVEL || "warning";
    return winston.createLogger({
      level: level,
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.label({ label: name }),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          const meta = info[Symbol.for("splat")];
          const metaStr = meta ? JSON.stringify(meta, null, 2) : "";
          return `${info.timestamp} [${info.label}] ${info.level}: ${info.message} ${metaStr}`;
        }),
      ),
      transports: [
        new winston.transports.Console({ level: level }),
        new winston.transports.File({
          filename: `logs/debug.log`,
          level: "debug",
        }),
        new winston.transports.File({
          filename: `logs/error.log`,
          level: "error",
        }),
      ],
    });
  }
}

export default LoggerFactory;
