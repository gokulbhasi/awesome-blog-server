const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/:storage/:img', (req, res, next) => {
  const options = {
    root: path.join(__dirname, `../../uploads/${req.params.storage}/`),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  // console.log(options.root)
  const fileName = req.params.img
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      // console.log('Sent:', fileName)
    }
  })
})
module.exports = router
