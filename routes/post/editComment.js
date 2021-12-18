const express = require('express')
const router = express.Router()
const Joi = require('joi')
const Comment = require('../../model/commentModel')

router.post('/', async (req, res, next) => {
  const { error } = validateComment(req.body)
  if (error) return res.status(400).send(error)
  try {
    const { commentId, comment } = req?.body
    Comment.updateOne({ _id: commentId }, { $set: { comment } })
      .exec()
      .then(result => res.status(200).json({
        status: true,
        message: 'Comment updated Successfully',
        data: {
          comment
        }
      }))
      .catch(error => res.status(500).json({ error }))
  } catch (e) {
    next(e)
  }
})

const validateComment = (commentData) => {
  const schema = Joi.object({
    commentId: Joi.string()
      .min(1)
      .required(),
    comment: Joi.string()
      .min(1)
      .required()
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
