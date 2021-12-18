const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

const Log = require('./startup/logger')
Log.error()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')(app)

// configuration
// debug('Application Name: ' + config.get('name')) //export NODE_ENV=production // DEBUG=app:startup nodemon index.js //

const port = process.env.PORT || 3000
app.listen(port, () => Log.logger.info(`awesome-blog-server is up on port ${port}`))
