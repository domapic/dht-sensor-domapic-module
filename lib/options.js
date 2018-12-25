'use strict'

const {
  INTERVAL_OPTION,
  SENSOR_TYPE_OPTION,
  EVENTS_STEP_OPTION,
  GPIO_OPTION
} = require('./statics')

module.exports = {
  [INTERVAL_OPTION]: {
    type: 'number',
    alias: ['refresh'],
    describe: 'Interval time for reading sensor values',
    default: 30000
  },
  [EVENTS_STEP_OPTION]: {
    type: 'number',
    describe: 'Emit an event only on changes upper than this value compared with last emitted event',
    default: 1
  },
  [SENSOR_TYPE_OPTION]: {
    type: 'number',
    alias: ['sensor'],
    choices: [22, 11],
    describe: 'Compatible DHT sensor type',
    default: 11
  },
  [GPIO_OPTION]: {
    type: 'number',
    describe: 'Gpio where the sensor is connected',
    demandOption: true
  }
}
