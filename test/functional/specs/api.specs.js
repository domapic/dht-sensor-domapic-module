const test = require('narval')

const utils = require('./utils')

test.describe('contact sensor api', function () {
  this.timeout(10000)
  let connection

  test.before(() => {
    connection = new utils.Connection()
  })

  test.describe('temperature state', () => {
    test.it('should return current temperature', () => {
      return connection.request('/abilities/temperature/state', {
        method: 'GET'
      }).then(response => {
        return Promise.all([
          test.expect(response.statusCode).to.equal(200),
          test.expect(response.body).to.deep.equal({
            data: 21
          })
        ])
      })
    })

    test.it('should return current humidity', () => {
      return connection.request('/abilities/humidity/state', {
        method: 'GET'
      }).then(response => {
        return Promise.all([
          test.expect(response.statusCode).to.equal(200),
          test.expect(response.body).to.deep.equal({
            data: 50
          })
        ])
      })
    })
  })
})
