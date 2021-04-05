import * as chai from 'chai'
import { describe, it } from 'mocha'
import nock from 'nock'

import * as dockerql from '../src'

// ----------------------------------------------
// Nock the dockerhub api
// ----------------------------------------------
const nockDockerHub = (username: string, password: string, wrongPassword: string, token: string) => {
  nock('https://hub.docker.com')
    .post('/v2/users/login/', {
      username,
      password: wrongPassword,
    })
    .reply(401, { "detail": "Incorrect authentication credentials" })

  nock('https://hub.docker.com')
    .post('/v2/users/login/', {
      username,
      password,
    })
    .reply(200, { token })

  nock('https://hub.docker.com',
    {
      reqheaders: {
        authorization: `Bearer ${token}`,
      },
    })
    .get('/v2/repositories/namespaces/')
    .reply(200,
      {
        namespaces: [
          'myuser',
          'myorg',
          'myorg2',
        ],
      })
}

// ----------------------------------------------
// Test dockerhub
// ----------------------------------------------
describe('Test dockerhub namespaces.', () => {
  nockDockerHub('myuser', 'right password', 'wrong password', 'thisistheabcsimplefaketoken')

  it('Connect using bad credentials (error)', async () => {
    try {
      dockerql.init({ loglevel: dockerql.LogLevels.Info })
      const res = await dockerql.connect({ name: "my-dockerhub", type: "dockerhub", username: "myuser", password: "wrong password" })
      chai.expect(res.code).to.eql(400) // Error if get to here
    } catch (err) {
      chai.expect(err.code).to.eql(401)
      chai.expect(err.message).to.eql('Incorrect authentication credentials.')
    }
  })

  it('Connect using good credentials', async () => {
    // setup the dockerql option, for now this means loglevel
    dockerql.init({ loglevel: dockerql.LogLevels.NoLogging })
    await dockerql.connect({ name: "dockerhub", type: "dockerhub" })
    await dockerql.connect({ name: "my-dockerhub", type: "dockerhub", username: "myuser", password: "right password" })
  })

  it('Select from namespaces with bad WHERE (error)', async () => {
    try {
      const res = await dockerql.query(`SELECT * FROM namespaces WHERE pulls="abc"`)
      chai.expect(res.code).to.eql(400) // Error if get to here
    } catch (err) {
      chai.expect(err.code).to.eql(400)
      chai.expect(err.message).to.eql(`WHERE for "Namespaces" may only filter by "Registry" and "Host".`)
    }
  })

  it('Select from namespaces with bad registry name (error)', async () => {
    try {
      const res = await dockerql.query(`SELECT * FROM namespaces WHERE registry="bad name"`)
      chai.expect(res.code).to.eql(400) // Error if get to here
    } catch (err) {
      chai.expect(err.code).to.eql(400)
      chai.expect(err.message).to.eql(`WHERE clause includes unknown registry name "bad name".`)
    }
  })

  it('Select from namespaces with bad where operator (error)', async () => {
    try {
      const res = await dockerql.query(`SELECT * FROM namespaces WHERE registry>"bad operator"`)
      chai.expect(res.code).to.eql(400) // Error if get to here
    } catch (err) {
      chai.expect(err.code).to.eql(400)
      chai.expect(err.message).to.eql(`WHERE for "Namespaces" may only filter by "Registry" and "Host".`)
    }
  })

  it('Simple select namespaces from authenticated registry', async () => {
    const res = await dockerql.query(`SELECT * FROM namespaces WHERE registry = "my-dockerhub"`)
    chai.expect(res.code).to.eql(200)
    chai.expect(res.data.length).to.eql(3)
    chai.expect(res.data[0]).to.eql({
      registry: 'my-dockerhub',
      host: 'hub.docker.com',
      namespace: 'myuser'
    })
  })

  it('Simple select namespaces from (default) unauthenticated registry', async () => {
    const res = await dockerql.query(`SELECT * FROM namespaces`)
    chai.expect(res.code).to.eql(200)
    chai.expect(res.data.length).to.eql(1)
    chai.expect(res.data[0]).to.eql({
      registry: 'dockerhub',
      host: 'hub.docker.com',
      namespace: 'library'
    })
  })

})
