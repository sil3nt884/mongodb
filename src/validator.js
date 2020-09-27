const csval = require('csval')
const fsPromise = require('fs').promises
const xlsx = require('node-xlsx')

let errorFound = false
const handleParsingError = (error) => {
  if (error) {
    console.log(error)
    errorFound = true
  }
}

const validateCVS = async (file) => {
  const data = await fsPromise.readFile(file, 'utf8')
  await csval.parseCsv(data)
    .catch(handleParsingError)
  if (errorFound) {
    return false
  } else {
    return true
  }
}

const validateXLS = async (file) => {
  const data = await fsPromise.readFile(file)
  return xlsx.parse(data)
}

const validateFile = async (file) => {
  const pattern = /^(?:(?!~\$).)+\.(?:xlsx?|csv)$/
  if (!pattern.test(file)) {
    return false
  } else {
    if (file.endsWith('.csv')) {
      return validateCVS(file)
    } else if (file.endsWith('.xls') || file.endsWith('.xlsx')) {
      const parsed = await validateXLS(file)
      if (parsed) {
        return true
      } else {
        return false
      }
    }
  }
}

module.exports = { validateFile }
