'use strict'

const path = require('path')

const domapic = require('domapic-service')

const pluginConfigs = require('./lib/plugins.json')

const options = require('./lib/options')
const Sensor = require('./lib/Sensor')

const {
  TEMPERATURE_NAME,
  TEMPERATURE_EVENT,
  TEMPERATURE_STATE,
  HUMIDITY_NAME,
  HUMIDITY_EVENT,
  HUMIDITY_STATE,
  INTERVAL_OPTION,
  EVENTS_STEP_OPTION,
  SENSOR_TYPE_OPTION,
  GPIO_OPTION
} = require('./lib/statics')

domapic.createModule({
  packagePath: path.resolve(__dirname),
  customConfig: options
}).then(async dmpcModule => {
  const config = await dmpcModule.config.get()

  const sensor = new Sensor(
    config[SENSOR_TYPE_OPTION],
    config[GPIO_OPTION],
    config[INTERVAL_OPTION],
    config[EVENTS_STEP_OPTION],
    dmpcModule.tracer
  )

  await dmpcModule.register({
    [TEMPERATURE_NAME]: {
      description: TEMPERATURE_STATE,
      data: {
        type: 'number'
      },
      state: {
        description: TEMPERATURE_STATE,
        handler: () => sensor.temperature
      },
      event: {
        description: TEMPERATURE_EVENT
      }
    },
    [HUMIDITY_NAME]: {
      description: HUMIDITY_STATE,
      data: {
        type: 'number',
        minimum: 0,
        maximum: 100
      },
      state: {
        description: HUMIDITY_STATE,
        handler: () => sensor.humidity
      },
      event: {
        description: HUMIDITY_EVENT
      }
    }
  })

  sensor.events.on(TEMPERATURE_NAME, newValue => {
    dmpcModule.tracer.debug(TEMPERATURE_EVENT, newValue)
    dmpcModule.events.emit(TEMPERATURE_NAME, newValue)
  })

  sensor.events.on(HUMIDITY_NAME, newValue => {
    dmpcModule.tracer.debug(HUMIDITY_EVENT, newValue)
    dmpcModule.events.emit(HUMIDITY_NAME, newValue)
  })

  await dmpcModule.addPluginConfig(pluginConfigs)

  return dmpcModule.start()
})
