const test = require('narval')

const dhtSensor = require('../../../lib/dhtSensor')

test.describe('dhtSensor', () => {
  test.describe('init method', () => {
    test.it('should throw an error if dth sensor library require fails', () => {
      let error
      try {
        dhtSensor.init()
      } catch (err) {
        error = err
      }
      test.expect(error).to.be.an.instanceOf(Error)
    })
  })

  test.describe('mock method', () => {
    test.it('should return a read method', () => {
      test.expect(dhtSensor.mock().read).to.not.be.undefined()
    })

    test.describe('mock read method', () => {
      test.it('should execute callback with fixed values', () => {
        const spy = test.sinon.spy()
        dhtSensor.mock().read(11, 4, spy)
        test.expect(spy).to.have.been.calledWith(null, 21, 50)
      })
    })
  })
})
