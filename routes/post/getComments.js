const express = require('express')
const router = express.Router()
const Joi = require('joi')
const Comment = require('../../model/commentModel')
const _ = require('lodash')
const { arrayToTree } = require('performant-array-to-tree')

router.get('/', (req, res, next) => {
  const { error } = validateUser(req.query)
  // console.log('BODY ', req.query)
  if (error) {
    next(error)
    return
  }

  Comment.find({ postId: req.query.postId })
    .sort({ createdAt: -1 })
    .lean()
    .exec(async function (err, comments) {
      if (err) {
        next(err)
      } else {
        const commentsParsed = arrayToTree(comments, { id: '_id', dataField: null }) // efficient and doesn't need to be in asc order
        // const getNestedComments = (selectedComment, commentsParsed, depth) => {
        //   commentsParsed.forEach((commentId) => {
        //     console.log(commentId)
        //     const value = commentId
        //     if (commentId._id.toString() === selectedComment.parentId.toString()) {
        //       value.children.push(selectedComment)
        //       // value.children[selectedComment._id] = selectedComment
        //       return
        //     }

        //     if (value.children && depth < 2) {
        //       // checking of replies
        //       getNestedComments(selectedComment, value.children, ++depth)
        //     }
        //   })
        // }
        // const commentsParsed = []
        // comments.forEach((comment) => {
        //   // parsing each comment
        //   comment.children = []
        //   if (comment?.parentId) {
        //     // checking of replies
        //     getNestedComments(comment, commentsParsed, 1)
        //   } else {
        //     // commentsParsed[comment._id] = comment
        //     commentsParsed.push(comment)
        //   }
        // })
        const response = {
          status: !_.isEmpty(comments),
          message: _.isEmpty(comments) ? 'No comments found' : 'comments found',
          data: commentsParsed
        }
        res.send(response)
      }
    })
})

const validateUser = (commentData) => {
  const schema = Joi.object({
    postId: Joi.string()
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
