const express = require('express')
const router = express.Router()
const Joi = require('joi')
const Post = require('../../model/postModel')
const _ = require('lodash')

router.post('/', async (req, res, next) => {
  const { error } = validatePost(req.body)
  if (error) return res.status(400).send(error)
  const { id, update } = req.body
  try {
    if (_.isEmpty(update)) {
      next('Empty Update Object')
      return
    }
    if ('image' in update) {
      delete update.image
    }
    await Post.updateOne({ _id: id }, update)

    const postResponse = await Post.findOne({ _id: id, $or: [{ isActive: true }, { isActive: { $exists: false } }] }).select({ title: 1, slug: 1, body: 1, image: 1, authorId: 1, published: 1, createdAt: 1, updatedAt: 1 })
    // console.log('postResponse', postResponse)
    const response = {
      status: true,
      message: 'Post Creation Successful',
      data: {
        ...postResponse._doc
      }
    }
    res.send(response)
  } catch (e) {
    next('Post Creation Failed')
  }
})

const validatePost = (postData) => {
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

  return schema.validate(postData, options)
}

module.exports = router
