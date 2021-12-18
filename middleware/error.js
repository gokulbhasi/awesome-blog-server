const Log = require('../startup/logger')

module.exports = function (err, req, res, next) {
  Log.logger.error(err.message, err)
  res
    .status(500)
    .send({ status: false, message: 'An Error has been Encountered', error: err, Bug: err.message })
}
