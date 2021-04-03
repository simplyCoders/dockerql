import * as chai from 'chai'
import { describe, it } from 'mocha'
import nock from 'nock'

import * as dockerql from '../src'

// ----------------------------------------------
// Nock the dockerhub api
// ----------------------------------------------
const nockDockerHub = (username: string, password: string, token: string) => {
  nock('https://hub.docker.com')
    .post('/v2/users/login/', {
      username,
      password,
    })
    .reply(200, { token })
}

// ----------------------------------------------
// Test the Registries table
// ----------------------------------------------
describe('Test the Registries table.', async () => {
  nockDockerHub('myuser', 'abcsimple', 'thisistheabcsimplefaketoken')

  it('Prepare the dockerql envrionment', async () => {
    // setup the dockerql option, for now this means loglevel
    dockerql.init()

    // connect to the registries, in this case two instances of docker hub, one annonimous and second with credentials
    await dockerql.connect({ name: "dockerhub", type: "dockerhub", namespace: "alpine" })
    await dockerql.connect({ name: "my-dockerhub", type: "dockerhub", username: "myuser", password: "abcsimple" })
  })

  it('Select from registries with WHERE is not supported', async () => {
    try {
      const res = await dockerql.query(`SELECT * FROM registries WHERE registry != "abc"`)
      chai.expect(res.code).to.eql(400) // Error if get to here
    } catch (err) {
      chai.expect(err.code).to.eql(400)
      chai.expect(err.message).to.eql(`Query the Registries table does not support the WHERE clause.`)
    }
  })

  it('Simple select from registries', async () => {
    try {
      const res = await dockerql.query(`SELECT * FROM registries`)
      chai.expect(res.code).to.eql(200)
      chai.expect(res.data.length).to.eql(2)
    } catch (err) {
      chai.expect(err.code).to.eql(200) // Error if get to here
    }
  })

  it('Select from registries with count(*)', async () => {
    try {
      const res = await dockerql.query(`Select count(*) from Registries`)
      chai.expect(res.code).to.eql(200)
      chai.expect(res.data.length).to.eql(1)
      chai.expect(res.data[0]['COUNT(*)']).to.eql(2)
    } catch (err) {
      chai.expect(err.code).to.eql(200) // Error if get to here
    }
  })

  it('Select from registries with columns', async () => {
    try {
      const res = await dockerql.query(`Select registry, type, namespace from Registries`)
      chai.expect(res.code).to.eql(200)
      chai.expect(res.data.length).to.eql(2)
      chai.expect(res.data[0].registry).to.eql('dockerhub')
      chai.expect(res.data[0].type).to.eql('dockerhub')
      chai.expect(res.data[0].namespace).to.eql('alpine')
    } catch (err) {
      chai.expect(err.code).to.eql(200) // Error if get to here
    }
  })
})
