const filesList = []

let previouslength
module.exports = (broker) => {
  broker.on('update file List', (file) => {
    console.log('added new file')
    filesList.push(file)
  })
  previouslength = filesList.length
  const emitOnUpdate = () => {
    setTimeout(() => {
      if (filesList.length > previouslength) {
        previouslength = filesList.length
        broker.emit('file list updated', filesList)
      }
      emitOnUpdate()
    }, 1000)
  }
  emitOnUpdate()

  broker.on('remove from file list', (file) => {
    const index = filesList.indexOf(file)
    filesList.splice(index, 1)
    previouslength = filesList.length
    console.log(filesList)
  })
}
