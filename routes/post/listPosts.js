const express = require('express')
const router = express.Router()
const Joi = require('joi')
const Post = require('../../model/postModel')
const async = require('async')

router.get('/', (req, res, next) => {
  const { err } = validatePostInput(req.query)
  if (err) {
    next(err)
    return
  }

  // query params
  const pgno = req.query.pgno ? req.query.pgno : 1
  const size = req.query.size ? req.query.size : 10

  async.parallel({
    count: callback => { // finding the count of posts
      Post.find()
        .countDocuments()
        .exec((err, count) => {
          callback(err, count)
        })
    },
    posts: callback => {
      Post.find()
        .sort({ updatedAt: -1 })
        .skip((pgno - 1) * size)
        .limit(size)
        .select({ title: 1, slug: 1, body: 1, image: 1, authorId: 1, published: 1, createdAt: 1, updatedAt: 1, isActive: 1 })
        .exec(function (err, posts) {
          callback(err, posts)
        })
    }
  }, async (err, results) => {
    const count = results.count
    const posts = results.posts
    if (err) next(err)
    else if (!posts) next('No Post Data Found')
    else {
      const pageCount = Math.ceil(count / size)
      const response = {
        message: 'posts found',
        status: pgno <= pageCount,
        count: count,
        pageNo: pgno,
        size: size,
        pagination: (pgno * size) < count,
        pages: pageCount,
        data: posts
      }
      res.send(response)
    }
  })
})

const validatePostInput = (postsData) => {
  const schema = Joi.object({
    userId: Joi.string()
      .min(1)
      .required(),
    pgno: Joi.number()
      .integer()
      .min(1)
      .default(0),
    size: Joi.number()
      .integer()
      .min(1)
      .default(10)
  })

  // schema options
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
  }

  return schema.validate(postsData, options)
}

module.exports = router
