const csv = require('csvtojson')
const xlsx = require('xlsx')

module.exports = (broker) => {

  const defaultSchema = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    county: '',
    postcode: '',
    sales: ''
  }

  const validateKeys = (keys) => {
    const isMatch = keys
      .map(key => key in defaultSchema)
      .filter(e => e === true).length > 0
    return isMatch
  }

  const handleCSV = async (file) => {
    const jsonArray = await csv().fromFile(file)
    jsonArray.forEach(json => {
      const keys = Object.keys(json)
      if (validateKeys(keys)) {
        broker.emit('send to mongoDB', json)
      }
    })
    broker.emit('remove from file list', file)
  }

  const xlsStreamToJSONArray = (workSheets) => {
    return new Promise((resolve) => {
      const array = []
      workSheets.forEach(sheet => {
        const stream = xlsx.stream.to_json(sheet, { raw: true })
        stream.on('data', (data) => array.push(data))
        stream.on('end', () => resolve(array))
      })
    })
  }

  const handleXLS = async (file) => {
    const workBook = xlsx.readFile(file)
    const sheetsNames = workBook.SheetNames
    const workSheets = sheetsNames.map(name => workBook.Sheets[name])
    const jsonArray = await xlsStreamToJSONArray(workSheets)
    jsonArray.forEach(json => {
      const keys = Object.keys(json)
      if (validateKeys(keys)) {
        broker.emit('send to mongoDB', json)
      }
    })
    broker.emit('remove from file list', file)
  }

  broker.on('file list updated', (filesList) => {
    filesList.forEach(async file => {
      if (file.endsWith('.csv')) {
        await handleCSV(file)
      } else if (file.endsWith('.xls') || file.endsWith('.xlsx')) {
        await handleXLS(file)
      }
    })
  })


}
