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
    .reply(200, { token: 'eyK1NWMiOlsiTUlJQytqA0NBcCtnQXdJQkFnSUJBREABOmdncWhrak9QUVFEQWpAY05VUXdRZ1lEVlFRREV6c7lWMDVgT2xWTFMxSTZSRTFFVWqpU1NVMUZPa3hITmtFNlExWnnWRHBOUmxWTU9rWXpTRVU2TlZBeVZUcExTak5HT2tOQk5sazZTa2xFVVRBZUZ3MHlNREV5TURFeU16SXpNREphRncweU1URXlNREV5TXpJek1ESmFNRVl4UkRCQ0JnTlZCQU1UT3pkYVRUVTZWVW96TkRwTFZWZE1PazFEUjFrNlZGQkJORHBGUVZGTE9rUllUalk2UTFWVlJEcFlObGxTT2t4TlNFVTZSRUpRUWpwU1RrcEZNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQTFkS1BcLzdHZ0YyZEtYVjhOelNnOTJMQlowOWZWSEd4NkxySUtQemV6dWhcL2VJZExlUlZ0XC9TcVZxQTdCeXlOWlZRRkRrOTI5XC9SWVdhcWVuQWZ5RThGbnpNS1FoOE5scXIrOWg1TFVqMUJMV2s4c2YyajJGN1VnWjVKRThYYmFlSVhzcXRwdDhtYTNsdlY0VTJ4alwvNmp0TWNKc3ZvVXp0dXhOQ1FwSGhBVHA3NVNNWERQUXNPNEFYZEJiQWt1V3RcL0VvVDFtNExmR1RZXC9cL2VuSVYxQWlxUTdmdTZyM2F6SWdcL1E2TlRcL1lqcXJXbnRXWmNLWG9mSHlldjI3a0xkZXJIQnhZdGtVaGlDb0lkMndVVCs1c3lIODd6WmxyekJ5dTZVOUxINnZEY2hiSEJSWTFnSWY4dmc1UFlvR3RQM3pvdUttd3ZFWFB4WmZnTWhlOTRkUFQ1VFFJREFRQUJvNEd5TUlHdk1BNEdBMVVkRHdFQlwvd1FFQXdJSGdEQVBCZ05WSFNVRUNEQUdCZ1JWSFNVQU1FUUdBMVVkRGdROUJEczNXazAxT2xWS016UTZTMVZYVERwTlEwZFpPbFJRUVRRNlJVRlJTenBFV0U0Mk9rTlZWVVE2V0RaWlVqcE1UVWhGT2tSQ1VFSTZVazVLUlRCR0JnTlZIU01FUHpBOWdEc3lWMDVaT2xWTFMxSTZSRTFFVWpwU1NVOUZPa3hITmtFNlExVllWRHBOUmxWTU9rWXpTRVU2TlZBeVZUcExTak5HT2tOQk5sazZTa2xFVVRBS0JnZ3Foa2pPUFFRREFnTkpBREJHQWlFQThCZTZjWjRKcHZJVVRXVzhSNFFOODQ3RXE2VXNMcSsyNVhkTkhaRUZEZVlDSVFETlZFaCt6SnhPWVBDcnRhM2xRZUdGTWgwZzVQcGRpdUpsR0l2OTFDMnhPZz09Il0sImFsZyI6IlJTMjU2IiwidHlwIjoiSldUIn0.eyJzZXNzaW9uX2lkIjoiQzZBRTVCNTlEMkFFMzM3MUQ0MDZEQUY4OTFGRDg5NDMiLCJpYXQiOjE2MTA4MzkyOTYsImV4cCI6MTYxMzQzMTI5Niwic3ViIjoiYWNlYjJjZGFlZWU2NGQ1OWJjZTRkYzMyZDNmYTk3OWMiLCJ1c2VybmFtZSI6ImV6Ym9yZ3kiLCJqdGkiOiJDNkFFNUI1OUQyQUUzMzcxRDQwNkRBRjg5MUZEODk0MyIsInVzZXJfaWQiOiJhY2ViMmNkYWVlZTY0ZDU5YmNlNGRjMzJkM2ZhOTc5YyIsImVtYWlsIjoiIn0.k5FAutt2wNKjME-eqeDF-hjwe5zMIENjBKLhStmq0NnHXoLx5Jx9UfcFMnAWOpaCF7njEWd7yOxKRi4NHk_0tOybwncEQ6q_Z3Z8SBVaslku_bgF7h50AcuVZkl_pJkOvFm9Dh5OAQAauFJDJgOojHg3FL4ALtuMtydDOciceMXV6tdbus2dZjgG3yC05sgBIAQowgqlk9YLkiSKw44VWofFp9VSGTe3ITOgWnaNrnoYxxUcWjL5Lz-qZS-Fcc5eAtZXqKkigg3IS-J0U0GJaevrozF4HQuzQVKXZ5miqbiQio9DPvzQMQSEQFfbZSd6KMcxvaQRxKwF04kUpHOq-Q' })
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
