const validator = require('./validator')

module.exports = (broker) => {
  broker.on('file uploaded', async (file) => {
    const isValidFile = await validator.validateFile(file)
    console.log('file is ', isValidFile)
    if (isValidFile) {
      broker.emit('update file List', file)
    }
  })
}
