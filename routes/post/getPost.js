const express = require('express')
const router = express.Router()
const Joi = require('joi')
const Post = require('../../model/postModel')
const _ = require('lodash')

router.get('/', (req, res, next) => {
  const { error } = validateUser(req.query)
  if (error) {
    next(error)
    return
  }
  Post.findOne({ _id: req.query.id, $or: [{ isActive: true }, { isActive: { $exists: false } }] })
    .select({ title: 1, slug: 1, body: 1, image: 1, name: 1, published: 1, createdAt: 1, updatedAt: 1 })
    .exec(async function (err, post) {
      if (err) {
        next(err)
      } else if (!post) {
        next('No post data Found')
      } else {
        const response = {
          status: !_.isEmpty(post),
          message: _.isEmpty(post) ? 'No post found' : 'post found',
          data: post
        }
        res.send(response)
      }
    })
})

const validateUser = (userData) => {
  const schema = Joi.object({
    id: Joi.string()
      .min(1)
      .required()
  })

  // schema options
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
  }
  return schema.validate(userData, options)
}

module.exports = router
