// config/logger.js
import { createLogger, format, transports } from 'winston';

// Обязательно создайте папку logs/ перед этим
const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    // ошибки уровня error
    new transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    // все записи info и выше
    new transports.File({
      filename: 'logs/combined.log'
    }),
    // дубль в консоль
    new transports.Console({ format: format.simple() })
  ]
});

export default logger;
