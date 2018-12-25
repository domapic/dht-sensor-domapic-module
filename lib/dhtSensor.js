'use strict'

const init = () => require('node-dht-sensor')

const mock = () => ({
  read: (type, gpio, cb) => cb(null, 21, 50)
})

module.exports = {
  init,
  mock
}
