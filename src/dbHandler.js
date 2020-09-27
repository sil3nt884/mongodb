const mongoose = require('mongoose')
const db = mongoose.connection
const { Schema } = mongoose

module.exports = (broker) => {
  const schema = new Schema({
    id: {
      type: String,
      required: true
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String
    },
    phone: {
      type: String
    },
    address1: {
      type: String
    },
    address2: {
      type: String
    },
    county: {
      type: String
    },
    postcode: {
      type: String
    },
    sales: {
      type: String
    }
  })

  const init = () => {
    mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })
    db.on('error', (err) => console.log(err))
    db.once('open', () => broker.emit('db connected'))
  }
  init()

  broker.once('db connected', () => {
    broker.on('send to mongoDB', (data) => {
      const Person = db.model('People', schema)
      const p = new Person(data)
      p.save((error, person) => {
        if (error) return console.error(error)
        console.log('id', person.id + ' saved to collection.')
      })
      console.log(data)
    })
  })
}
