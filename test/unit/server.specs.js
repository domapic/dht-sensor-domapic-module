const test = require('narval')

test.describe('server', () => {
  test.it('should exists', () => {
    require('../../server')
    test.expect(true).to.be.true()
  })
})
