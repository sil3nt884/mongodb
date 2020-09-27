const Event = require('events')
module.exports = class extends Event {
  emit (event, ...args) {
    console.log(`${event} emitted`)
    super.emit(event, ...args)
    return true
  }
}
