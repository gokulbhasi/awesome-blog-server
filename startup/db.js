const Log = require('./logger')
const mongoose = require('mongoose')
const config = require('config')

module.exports = function () {
  mongoose
    .connect(config.get('db'), {
      useUnifiedTopology: true,
      autoIndex: false
    })
    .then(() =>
      Log.logger.info(`Connected to db : ${config.get('collectionName')}`)
    )
}
