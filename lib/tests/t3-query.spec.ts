import * as chai from 'chai'
import { describe, it } from 'mocha'

import * as dockerql from '../src'

// ----------------------------------------------
// Run basic tests
// ----------------------------------------------
describe('Test dockerql.query().', async () => {

  it('Prepare the dockerql envrionment', async () => {
    // setup the dockerql option, for now this means loglevel
    dockerql.init()

    // connect to a registry, in this case dockerhub with anonymous access
    await dockerql.connect({ name: "dockerhub", type: "dockerhub" })
  })

  it('Query with empty SQL', async () => {
    try {
      const res = await dockerql.query(``)
      chai.expect(res.code).to.eql(400) // Error if get to here
    } catch (err) {
      chai.expect(err.code).to.eql(400)
      chai.expect(err.message).to.eql(`SQL statement can not be empty.`)
    }
  })

  it('Query SQL is not valid SQL statement', async () => {
    try {
      const res = await dockerql.query(`This is just a random string`)
      chai.expect(res.code).to.eql(400) // Error if get to here
    } catch (err) {
      chai.expect(err.code).to.eql(400)
      chai.expect(err.message).to.eql(`Expected "$", "(", "CREATE", "DELETE", "INSERT", "REPLACE", "SELECT", "UPDATE", "return", WHITE_SPACE, or end of input but "T" found.`)
    }
  })

  it('Query SQL is not "SELECT"', async () => {
    try {
      const res = await dockerql.query(`INSERT INTO repos (name) VALUES ("myRepo")`)
      chai.expect(res.code).to.eql(400) // Error if get to here
    } catch (err) {
      chai.expect(err.code).to.eql(400)
      chai.expect(err.message).to.eql(`Expected 'SELECT' statement but 'insert' found.`)
    }
  })

  it('Table not in db scheme', async () => {
    try {
      const res = await dockerql.query(`SELECT * from myTable`)
      chai.expect(res.code).to.eql(400) // Error if get to here
    } catch (err) {
      chai.expect(err.code).to.eql(400)
      chai.expect(err.message).to.eql(`Unknown table name "mytable".`)
    }
  })

  it('Simple valid SQL to fetch registries', async () => {
    try {
      const res = await dockerql.query(`SELECT * FROM registries`)
      chai.expect(res.code).to.eql(200)
      chai.expect(res.data.length).to.eql(1)
    } catch (err) {
      chai.expect(err.code).to.eql(200) // Error if get to here
    }
  })
})
