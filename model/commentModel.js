const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
  postId: {
    type: String,
    ref: 'posts',
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  depth: {
    type: Number,
    default: 1
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  }
}, { timestamps: true })

// update timestamps on save
commentsSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  if (this.isNew) this.createdAt = this.updatedAt
  next()
})

// create and export our model
module.exports = mongoose.model('comments', commentsSchema)
