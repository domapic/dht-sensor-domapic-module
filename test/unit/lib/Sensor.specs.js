const test = require('narval')

const DomapicMocks = require('../Domapic.mocks')

const Sensor = require('../../../lib/Sensor')

test.describe('Sensor', () => {
  let domapic
  let sensor
  let sandbox

  test.beforeEach(async () => {
    sandbox = test.sinon.createSandbox()
    domapic = new DomapicMocks()
    sensor = new Sensor(11, 2, 3000, 2, domapic.stubs.module.tracer)
  })

  test.afterEach(() => {
    sandbox.restore()
    domapic.restore()
    clearInterval(sensor._interval)
  })

  test.describe('readValues method', () => {
    test.it('should call to read sensor values, passing refreshValues as callback', () => {
      sandbox.spy(sensor._eventEmitter, 'emit')
      sensor.readValues()
      test.expect(sensor._eventEmitter.emit).to.have.been.called()
    })
  })

  test.describe('refreshValues method', () => {
    test.it('should trace when receives an error', () => {
      sensor.refreshValues(new Error(), 10, 20)
      test.expect(domapic.stubs.module.tracer.error).to.have.been.called()
    })

    test.it('should emit a temperature event when it increase more than defined step', () => {
      sandbox.spy(sensor._eventEmitter, 'emit')
      sensor.refreshValues(null, 10, 20)
      test.expect(sensor._eventEmitter.emit).to.have.been.calledWith('temperature', 10)
    })

    test.it('should emit a temperature event when it decrease more than defined step', () => {
      sandbox.spy(sensor._eventEmitter, 'emit')
      sensor.refreshValues(null, -4, 20)
      test.expect(sensor._eventEmitter.emit).to.have.been.calledWith('temperature', -4)
    })

    test.it('should emit an humidity event when it increase more than defined step', () => {
      sandbox.spy(sensor._eventEmitter, 'emit')
      sensor.refreshValues(null, 1, 10)
      test.expect(sensor._eventEmitter.emit).to.have.been.calledWith('humidity', 10)
    })

    test.it('should emit an humidity event when it decrease more than defined step', () => {
      sandbox.spy(sensor._eventEmitter, 'emit')
      sensor.refreshValues(null, 1, -5)
      test.expect(sensor._eventEmitter.emit).to.have.been.calledWith('humidity', -5)
    })

    test.it('should not emit events if there is no humidity nor temperature increase', () => {
      sandbox.spy(sensor._eventEmitter, 'emit')
      sensor.refreshValues(null, 1, 1)
      test.expect(sensor._eventEmitter.emit).to.not.have.been.called()
    })
  })

  test.describe('temperature getter', () => {
    test.it('should return current temperature', () => {
      sensor._temperature = 46
      test.expect(sensor.temperature).to.equal(46)
    })
  })

  test.describe('humidity getter', () => {
    test.it('should return current humidity', () => {
      sensor._humidity = 53
      test.expect(sensor.humidity).to.equal(53)
    })
  })

  test.describe('events getter', () => {
    test.it('should return sensor eventEmitter', () => {
      test.expect(sensor.events).to.equal(sensor._eventEmitter)
    })
  })
})
