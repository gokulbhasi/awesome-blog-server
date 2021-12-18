const express = require('express')
const { auth } = require('../middleware/auth')
const error = require('../middleware/error')
const helmet = require('helmet')
const morgan = require('morgan')
// routes
const createPost = require('../routes/post/createPost')
const getPost = require('../routes/post/getPost')
const editPost = require('../routes/post/editPost')
const createComment = require('../routes/post/createComment')
const editComment = require('../routes/post/editComment')
const getComments = require('../routes/post/getComments')
const listPosts = require('../routes/post/listPosts')
const home = require('../routes/home')

module.exports = function (app) {
  // middlewares
  app.use(express.json({ limit: '10mb' })) // limit upload size
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  app.use(express.static('public'))
  app.use('/api/image/', home)
  app.use(auth)
  app.use(helmet())
  app.use(morgan('tiny')) // logging http requests
  // api
  app.use('/api/editPost', editPost)
  app.use('/api/getPost', getPost)
  app.use('/api/createComment', createComment)
  app.use('/api/editComment', editComment)
  app.use('/api/getComments', getComments)
  app.use('/api/listPosts', listPosts)

  app.use('/api/createPost', createPost)
  app.use(error)
}
