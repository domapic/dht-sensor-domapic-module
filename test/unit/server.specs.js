const path = require('path')

const test = require('narval')

const DomapicMocks = require('./Domapic.mocks')
const SensorMocks = require('./lib/Sensor.mocks')

test.describe('server', () => {
  const fooConfig = {
    sensorType: 4,
    gpio: 23,
    interval: 3000,
    eventsStep: 1
  }
  let domapic
  let sensor
  let abilities

  test.before(async () => {
    domapic = new DomapicMocks()
    sensor = new SensorMocks()
    domapic.stubs.module.config.get.resolves(fooConfig)
    require('../../server')
    domapic.utils.executeModuleListener(domapic.stubs.module)
    await domapic.utils.resolveOnStartCalled()
    abilities = domapic.stubs.module.register.getCall(0).args[0]
  })

  test.after(() => {
    sensor.restore()
    domapic.restore()
  })

  test.describe('when required', () => {
    test.it('should have created a Domapic Module, passing the package path', () => {
      test.expect(domapic.stubs.createModule.getCall(0).args[0].packagePath).to.equal(path.resolve(__dirname, '..', '..'))
    })
  })

  test.describe('when domapic module is returned', () => {
    test.it('should have created a new Sensor', () => {
      test.expect(sensor.stubs.Constructor).to.have.been.calledWith(
        fooConfig.sensorType,
        fooConfig.gpio,
        fooConfig.interval,
        fooConfig.eventsStep,
        domapic.stubs.module.tracer
      )
    })

    test.it('should have registered abilities', () => {
      abilities = domapic.stubs.module.register.getCall(0).args[0]
      test.expect(domapic.stubs.module.register).to.have.been.called()
    })

    test.it('should have added plugins configurations', () => {
      test.expect(domapic.stubs.module.addPluginConfig).to.have.been.called()
    })

    test.it('should have called to start the server', () => {
      test.expect(domapic.stubs.module.start).to.have.been.called()
    })

    test.describe('temperature state handler', () => {
      test.it('should return current temperature value from sensor', () => {
        sensor.stubs.instance.temperature = 24
        test.expect(abilities.temperature.state.handler()).to.equal(24)
      })
    })

    test.describe('humidity state handler', () => {
      test.it('should return current humidity value from sensor', () => {
        sensor.stubs.instance.humidity = 40
        test.expect(abilities.humidity.state.handler()).to.equal(40)
      })
    })

    test.describe('sensor temperature event listener', () => {
      test.it('should emit a temperature event', () => {
        sensor.stubs.instance.events.on.getCall(0).args[1](64)
        test.expect(domapic.stubs.module.events.emit).to.have.been.calledWith('temperature', 64)
      })
    })

    test.describe('sensor humidity event listener', () => {
      test.it('should emit an humidity event', () => {
        sensor.stubs.instance.events.on.getCall(1).args[1](45)
        test.expect(domapic.stubs.module.events.emit).to.have.been.calledWith('humidity', 45)
      })
    })
  })
})
