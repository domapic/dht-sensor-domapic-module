'use strict'

const EventEmitter = require('events')

const dhtSensor = require('./dhtSensor')

const {
  TEMPERATURE_NAME,
  HUMIDITY_NAME
} = require('./statics')

class SensorEventsEmitter extends EventEmitter {}

class Sensor {
  constructor (sensorType, gpio, interval, eventsStep, tracer) {
    this._sensorType = sensorType
    this._gpio = gpio
    this._tracer = tracer
    this._eventsStep = eventsStep

    this._temperature = 0
    this._lastEmittedTemperature = 0
    this._humidity = 0
    this._lastEmittedHumidity = 0

    try {
      this._sensor = dhtSensor.init()
    } catch (error) {
      tracer.error('Error initializing dht-sensor. Entering in mock mode')
      this._sensor = dhtSensor.mock()
    }
    this._eventEmitter = new SensorEventsEmitter()
    this._interval = setInterval(this.readValues.bind(this), interval)
  }

  readValues () {
    this._sensor.read(this._sensorType, this._gpio, this.refreshValues.bind(this))
  }

  roundValue (value) {
    return Math.round(value * 10) / 10
  }

  absoluteChange (value, previousValue) {
    return Math.abs(value - previousValue)
  }

  refreshValues (error, temperature, humidity) {
    if (error) {
      this._tracer.error('Error reading dht-sensor values', error.message)
      this._tracer.debug(error)
    } else {
      this.checkNewTemperature(this.roundValue(temperature))
      this.checkNewHumidity(this.roundValue(humidity))
    }
  }

  checkNewTemperature (newTemperature) {
    if (this.absoluteChange(newTemperature, this._lastEmittedTemperature) > this._eventsStep) {
      this._lastEmittedTemperature = newTemperature
      this._eventEmitter.emit(TEMPERATURE_NAME, newTemperature)
    }
    this._temperature = newTemperature
  }

  checkNewHumidity (newHumidity) {
    if (this.absoluteChange(newHumidity, this._lastEmittedHumidity) > this._eventsStep) {
      this._lastEmittedHumidity = newHumidity
      this._eventEmitter.emit(HUMIDITY_NAME, newHumidity)
    }
    this._humidity = newHumidity
  }

  get temperature () {
    return this._temperature
  }

  get humidity () {
    return this._humidity
  }

  get events () {
    return this._eventEmitter
  }
}

module.exports = Sensor
