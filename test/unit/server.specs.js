const path = require('path')

const test = require('narval')

const DomapicMocks = require('./Domapic.mocks')
const SensorMocks = require('./lib/Sensor.mocks')

test.describe('server', () => {
  let domapic
  let sensor
  // let abilities

  test.before(async () => {
    domapic = new DomapicMocks()
    sensor = new SensorMocks()
    domapic.stubs.module.config.get.resolves({})
    require('../../server')
    domapic.utils.executeModuleListener(domapic.stubs.module)
    await domapic.utils.resolveOnStartCalled()
    // abilities = domapic.stubs.module.register.getCall(0).args[0]
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
})
