const jwt = require('jsonwebtoken')
const config = require('config')

const auth = (req, res, next) => {
  // console.log(req.body)
  const token = req.header('x-auth-token')

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, X-Auth-Token'
  )
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Accept', 'application/json')

  if (!token) {
    res
      .status(401)
      .send({ status: false, message: 'Access denied. No token provided' })
  } else {
    try {
      const decodedToken = jwt.verify(token, config.get('webToken'))
      if (decodedToken.code === config.get('accessCode').code) {
        next()
      } else {
        res
          .status(400)
          .send({ status: false, message: 'Access denied. Invalid token' })
      }
    } catch (e) {
      res
        .status(400)
        .send({ status: false, message: 'Access denied. Could not match token' })
    }
  }
}

module.exports = { auth }
