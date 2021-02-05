import * as chai from 'chai'
import { describe, it } from 'mocha'
import request from 'supertest'
import nock from 'nock'

import { server } from '../src/server/index'

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
// Test the Registries table
// ----------------------------------------------
describe('Query the Registries table.', () => {
  nockDockerHub('myuser', 'abcsimple')

  it('Expected error. Select Registries with where clause', async () => {
    const res = await request(app).get('/v1/query?sql=SELECT * FROM registries WHERE registry != "abc"')
    chai.expect(res.status).to.eql(400)
    chai.expect(res.body.code).to.eql(400)
    chai.expect(res.body.message).to.eql('Query the "Registries" table does not support the WHERE clause.')
  })

  it('Select Registries table', async () => {
    const res = await request(app).get('/v1/query?sql=SELECT * FROM registries')
    chai.expect(res.status).to.eql(200)
    chai.expect(res.body.code).to.eql(200)
    chai.expect(res.body.message).to.eql('Query executed successfully.')
    chai.expect(res.body.count).to.eql(2)
  })

  it('Select Registries table with mix upper/lower case', async () => {
    const res = await request(app).get('/v1/query?sql=sElEcT * from Registries')
    chai.expect(res.status).to.eql(200)
    chai.expect(res.body.code).to.eql(200)
    chai.expect(res.body.message).to.eql('Query executed successfully.')
    chai.expect(res.body.count).to.eql(2)
  })

  it('Select count', async () => {
    const res = await request(app).get('/v1/query?sql=Select count(*) from Registries')
    chai.expect(res.status).to.eql(200)
    chai.expect(res.body.code).to.eql(200)
    chai.expect(res.body.message).to.eql('Query executed successfully.')
    chai.expect(res.body.count).to.eql(1)
    chai.expect(res.body.data[0]['COUNT(*)']).to.eql(2)
  })

  it('Select specific fields', async () => {
    const res = await request(app).get('/v1/query?sql=Select registry, type, namespace from Registries')
    chai.expect(res.status).to.eql(200)
    chai.expect(res.body.code).to.eql(200)
    chai.expect(res.body.message).to.eql('Query executed successfully.')
    chai.expect(res.body.count).to.eql(2)
    chai.expect(Object.keys(res.body.data[0]).length).to.eql(3)
    chai.expect(res.body.data[0].registry).to.eql('dockerhub')
    chai.expect(res.body.data[0].type).to.eql('dockerhub')
    chai.expect(res.body.data[0].namespace).to.eql('alpine')
  })
})
