const test = require('narval')

const mockery = require('../mockery')

const MODULE = './lib/Sensor'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const instanceStubs = {
    temperature: 21,
    humidity: 50,
    events: {
      on: sandbox.stub()
    }
  }

  const stub = sandbox.stub().callsFake(function () {
    return instanceStubs
  })

  const restore = () => {
    sandbox.restore()
    mockery.deregister(MODULE)
  }

  mockery.register(MODULE, stub)

  return {
    restore,
    stubs: {
      Constructor: stub,
      instance: instanceStubs
    }
  }
}

module.exports = Mock
