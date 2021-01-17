import * as chai from 'chai'
import { describe, it } from 'mocha'
import request from 'supertest'
import nock from 'nock'

import { server } from '../src/index'

const app = server()

// ----------------------------------------------
// Nock the dockerhub api
// ----------------------------------------------
const nockDockerHub = (username: string, password: string) => {
  nock('https://hub.docker.com')
    .post('/v2/users/login/', {
      username,
      password,
    })
    .reply(200, { token: 'thisistheabcsimplefaketoken' })
}

// ----------------------------------------------
// Run basic tests
// ----------------------------------------------
describe('Check if service is up.', () => {
  nockDockerHub('simplycoders', 'abcsimple')

  it('Ping the base url and get 404', async () => {
    const res = await request(app).get('/')
    chai.expect(res.status).to.eql(404)
  })

  it('Query endpoint without \'sql\' query parameter', async () => {
    const res = await request(app).get('/v1/query')
    chai.expect(res.status).to.eql(400)
    chai.expect(res.body.code).to.eql(400)
    chai.expect(res.body.message).to.eql('Expected a "sql" query parameter.')
  })

  it('Query endpoint with empty sql statement', async () => {
    const res = await request(app).get('/v1/query?sql=')
    chai.expect(res.status).to.eql(400)
    chai.expect(res.body.code).to.eql(400)
    chai.expect(res.body.message).to.eql('Expected "SELECT" statement but "undefined" found.')
  })
})
