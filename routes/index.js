const express = require('express')
const multer = require('multer')
const upload = multer()
const fs = require('fs')

module.exports = (broker) => {
  const router = express.Router()
  router.post('/upload', upload.single('file'), function (req, res, next) {
    const fileObj = req.file
    const fileName = fileObj.originalname
    const buffer = fileObj.buffer
    const fileDir = `uploads/${fileName}`
    fs.writeFileSync(fileDir, buffer, 'utf8')
    broker.emit('file uploaded', fileDir)
    res.status(200).send('ok')
  })
  return router
}
