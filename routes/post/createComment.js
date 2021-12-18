const express = require('express')
const router = express.Router()
const Joi = require('joi')
const Comment = require('../../model/commentModel')

router.post('/', async (req, res, next) => {
  const { error } = validateComment(req.body)
  if (error) return res.status(400).send(error)
  const { postId, name, comment, parentId, depth } = req?.body
  if (parentId in req?.body && !(depth in req?.body)) {
    return res.status(400).send('please provide depth.')
  }
  try {
    const commentData = new Comment({
      postId,
      name,
      comment,
      parentId,
      depth
    })

    commentData.save()
      .then(data => res.send({
        status: true,
        message: 'Comment added Successfully',
        data
      }))
      .catch(error => res.status(500).json({ error }))
  } catch (e) {
    next(e)
  }
})

const validateComment = (commentData) => {
  const schema = Joi.object({
    postId: Joi.string()
      .min(1)
      .required(),
    name: Joi.string()
      .min(1)
      .required(),
    comment: Joi.string()
      .min(1)
      .required(),
    parentId: Joi.string()
      .min(1)
      .default(null),
    depth: Joi.number()
      .integer()
      .min(1)
      .default(0)
  })

  // schema options
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
  }

  return schema.validate(commentData, options)
}

module.exports = router
