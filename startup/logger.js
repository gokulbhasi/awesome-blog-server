const { createLogger, transports, format } = require('winston')
require('express-async-errors')

// temporary logger
const logger = createLogger({
  level: 'info',
  format: format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console({
      colorize: 'true',
      datePattern: '.yyyy-MM-dd',
      prettyPrint: 'true'
    }),
    new transports.File({
      filename: 'log/error.log',
      timestamp: true,
      datePattern: '.yyyy-MM-dd',
      level: 'error'
    }),
    new transports.File({
      filename: 'log/logfile.log',
      datePattern: '.yyyy-MM-dd',
      timestamp: true
    })
  ]
})

logger.exceptions.handle(
  new transports.File({ filename: 'log/exceptions.log' })
)
const error = function () {
  process.on('uncaughtException', ex => {
    logger.error(ex.message, ex)
    process.exit(1)
  })

  process.on('unhandledRejection', ex => {
    logger.error(ex.message, ex)
    process.exit(1)
  })
}
module.exports = {
  logger: logger,
  error: error
}
