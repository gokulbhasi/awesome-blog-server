const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const postsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    slug: 'title'
  },
  body: {
    type: String,
    required: true
  },
  image: {
    type: Array
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  published: {
    type: Boolean,
    required: true,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

// update timestamps on save
postsSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  if (this.isNew) this.createdAt = this.updatedAt
  next()
})

// create and export our model

module.exports = mongoose.model('posts', postsSchema)
