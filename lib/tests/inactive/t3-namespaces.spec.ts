import * as chai from 'chai'
import { describe, it } from 'mocha'
import request from 'supertest'
import nock from 'nock'

import * as dockerql from '../../src'
// TODO

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

  nock('https://hub.docker.com',
    {
      reqheaders: {
        authorization: 'Bearer thisistheabcsimplefaketoken',
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
// Test the Namespaces table (using dockerhub)
// ----------------------------------------------
describe('Query the Registries table.', () => {
  nockDockerHub('myuser', 'abcsimple')
/*
  it('Expected error. Select Namespaces with unknown column in the where clause', async () => {
    const res = await request(app).get('/v1/query?sql=SELECT * FROM namespaces WHERE name != "abc"')
    chai.expect(res.status).to.eql(400)
    chai.expect(res.body.code).to.eql(400)
    chai.expect(res.body.message).to.eql('WHERE for "Namespaces" may only filter by "Registry" and "Host".')
  })

  it('Expected error. Select Namespaces table for unknown registry ', async () => {
    const res = await request(app).get('/v1/query?sql=SELECT * FROM namespaces WHERE registry="something"')
    chai.expect(res.status).to.eql(400)
    chai.expect(res.body.code).to.eql(400)
    chai.expect(res.body.message).to.eql('WHERE clause includes unknown registry name "something".')
  })

  it('Expected error. Select Namespaces where with > operator ', async () => {
    const res = await request(app).get('/v1/query?sql=SELECT * FROM namespaces WHERE registry>"my-dockerhub"')
    chai.expect(res.status).to.eql(400)
    chai.expect(res.body.code).to.eql(400)
    chai.expect(res.body.message).to.eql('WHERE for "Namespaces" may only filter by "Registry" and "Host".')
  })

  it('Select Namespaces table for default registry (returns zero namespaces)', async () => {
    const res = await request(app).get('/v1/query?sql=SELECT * FROM namespaces')
    chai.expect(res.status).to.eql(200)
    chai.expect(res.body.code).to.eql(200)
    chai.expect(res.body.message).to.eql('Query executed successfully.')
    chai.expect(res.body.count).to.eql(0)
  })

  it('Select Namespaces table for my-dockerhub ', async () => {
    const res = await request(app).get('/v1/query?sql=SELECT * FROM namespaces WHERE registry="my-dockerhub"')
    chai.expect(res.status).to.eql(200)
    chai.expect(res.body.code).to.eql(200)
    chai.expect(res.body.message).to.eql('Query executed successfully.')
    chai.expect(res.body.count).to.eql(3)
  })
*/
})
