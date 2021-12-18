const express = require('express')
const router = express.Router()
const Joi = require('joi')
const Post = require('../../model/postModel')
const config = require('config')
const slugify = require('slugify')
const fs = require('fs')
const _ = require('lodash')
const { v4: uuidv4 } = require('uuid')

router.post('/', async (req, res, next) => {
  const { error } = validatePost(req.body)
  if (error) return res.status(400).send(error)
  const { title, body, name, image } = req?.body
  const published = Boolean(req?.body?.published)
  const slug = slugify(title)
  try {
    let imageUrl = ''
    if (!_.isEmpty(image)) {
      const folderName = 'post'
      // checking for folders
      if (!fs.existsSync('../uploads/')) {
        fs.mkdirSync('../uploads/')
        fs.mkdirSync(`../uploads/${folderName}/`)
      } else if (!fs.existsSync(`../uploads/${folderName}/`)) {
        fs.mkdirSync(`../uploads/${folderName}/`)
      }
      // fetching imageType and imageData from base64 data
      let matches = []
      try {
        matches = image?.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/)
        if (!_.isEmpty(matches)) {
          const imageType = matches[1]
          const imageData = matches[2]

          const name = `${uuidv4()}.${imageType}`
          const url = `${config.get('ipAddress')}api/image/${folderName}/${name}`
          const path = `../uploads/${folderName}/${name}`

          // saving file
          await fs.writeFileSync(path, imageData, { encoding: 'base64' })
          imageUrl = url
        }
      } catch (e) {
        next('Please send an image in base64 format or send as a file', e)
      }
    }
    // console.log(imageUrl)
    const postData = new Post({
      title,
      slug,
      body,
      image: imageUrl,
      name,
      published
    })

    const data = await postData.save()
    // console.log('data', data)
    // const postResponse = await Post.findOne({ _id: data._id }).select({ title: 1, slug: 1, body: 1, contentType: 1, content: 1, name: 1, published: 1, createdAt: 1, updatedAt: 1 })

    const response = {
      status: true,
      message: 'Post Creation Successful',
      data
    }
    res.send(response)
  } catch (e) {
    next(e)
  }
})

const validatePost = (postData) => {
  const schema = Joi.object({
    title: Joi.string()
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
