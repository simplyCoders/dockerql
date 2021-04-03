import * as chai from 'chai'
import { describe, it } from 'mocha'

import * as dockerql from '../src'

// ----------------------------------------------
// Run basic tests
// ----------------------------------------------
describe('Test dockerql.init().', async () => {

  it('Options as number (error)', async () => {
    try {
      // @ts-expect-error
      dockerql.init(1)
      chai.expect(0).to.eql(400) // Error if get to here
    } catch (err) {
      chai.expect(err.code).to.eql(400)
      chai.expect(err.message).to.eql(`Invalid Options parameter was provided.`)
    }
  })

  it('Options with unknown key (error)', async () => {
    try {
      // @ts-expect-error
      dockerql.init({mything:1})
      chai.expect(0).to.eql(400) // Error if get to here
    } catch (err) {
      chai.expect(err.code).to.eql(400)
      chai.expect(err.message).to.eql(`Invalid Options parameter was provided.`)
    }
  })

  it('Options.loglevel with string (error)', async () => {
    try {
      // @ts-expect-error
      dockerql.init({loglevel:"error"})
      chai.expect(0).to.eql(400) // Error if get to here
    } catch (err) {
      chai.expect(err.code).to.eql(400)
      chai.expect(err.message).to.eql(`Invalid Options parameter was provided.`)
    }
  })

  it('Options.loglevel with too high number (error)', async () => {
    try {
      dockerql.init({loglevel:5})
      chai.expect(0).to.eql(400) // Error if get to here
    } catch (err) {
      chai.expect(err.code).to.eql(400)
      chai.expect(err.message).to.eql(`Invalid Options.loglevel value was provided.`)
    }
  })

  it('No options', async () => {
    try {
      dockerql.init()
      chai.expect(200).to.eql(200) // if get to here the success
    } catch (err) {
      chai.expect(err.code).to.eql(200) // Error if get to here
    }
  })

  it('Options.loglevel = NoLogging', async () => {
    try {
      dockerql.init({loglevel:dockerql.LogLevels.NoLogging})
      chai.expect(200).to.eql(200) // if get to here the success
    } catch (err) {
      chai.expect(err.code).to.eql(200) // Error if get to here
    }
  })
})
