const config = require('config')
module.exports = function (app) {
  if (app.get('env') === 'development') {
    // set NODE_ENV=production
    const morgan = require('morgan')
    app.use(morgan('tiny'))
  }
  if (!config.get('accessCode')) {
    throw new Error('FATAl ERROR: accessCode is not defined')
  } else if (!config.get('webToken')) {
    throw new Error('FATAl ERROR: webToken is not defined')
  } else if (!config.get('collectionName')) {
    throw new Error('FATAl ERROR: collectionName is not defined')
  } else if (!config.get('db')) {
    throw new Error('FATAl ERROR: db is not defined')
  }
}
