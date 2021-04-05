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
                authorization: `Bearer ${token}`
            },
        })
        .get('/v2/repositories/simplycoders/')
        .reply(200,
            {
                "count": 2,
                "next": null,
                "previous": null,
                "results": [
                    {
                        "user": "simplycoders",
                        "name": "dockerql",
                        "namespace": "simplycoders",
                        "repository_type": "image",
                        "status": 1,
                        "description": "A read-only SQL-like interface for docker registries. ",
                        "is_private": false,
                        "is_automated": false,
                        "can_edit": true,
                        "star_count": 0,
                        "pull_count": 125,
                        "last_updated": "2021-04-03T03:59:10.208553Z",
                        "is_migrated": false,
                        "collaborator_count": 0,
                        "affiliation": "owner",
                        "hub_user": "simplycoders"
                    },
                    {
                        "user": "simplycoders",
                        "name": "test",
                        "namespace": "simplycoders",
                        "repository_type": null,
                        "status": 0,
                        "description": "this is a test repo within the org simplycoders",
                        "is_private": false,
                        "is_automated": false,
                        "can_edit": true,
                        "star_count": 0,
                        "pull_count": 0,
                        "last_updated": null,
                        "is_migrated": false,
                        "collaborator_count": 0,
                        "affiliation": "owner",
                        "hub_user": "simplycoders"
                    }
                ]
            })
}

// ----------------------------------------------
// Test dockerhub
// ----------------------------------------------
describe('Test dockerhub repos.', () => {
    nockDockerHub('myuser', 'right password', 'wrong password', 'thisistheabcsimplefaketoken')

    it('Connect using good credentials', async () => {
        // setup the dockerql option, for now this means loglevel
        dockerql.init({ loglevel: dockerql.LogLevels.NoLogging })
        await dockerql.connect({ name: "dockerhub", type: "dockerhub" })
        await dockerql.connect({ name: "my-dockerhub", type: "dockerhub", username: "myuser", password: "right password" })
    })

    it('Select from repos with bad WHERE (error)', async () => {
        try {
            const res = await dockerql.query(`SELECT * FROM repos WHERE pulls="abc"`)
            chai.expect(res.code).to.eql(400) // Error if get to here
        } catch (err) {
            chai.expect(err.code).to.eql(400)
            chai.expect(err.message).to.eql(`WHERE for "Repos" may only filter by "Registry", "Host" and "Namespace".`)
        }
    })

    it('Select from repos with bad registry name (error)', async () => {
        try {
            const res = await dockerql.query(`SELECT * FROM repos WHERE registry="bad name"`)
            chai.expect(res.code).to.eql(400) // Error if get to here
        } catch (err) {
            chai.expect(err.code).to.eql(400)
            chai.expect(err.message).to.eql(`WHERE clause includes unknown registry name "bad name".`)
        }
    })

    it('Select from repos with bad where operator (error)', async () => {
        try {
            const res = await dockerql.query(`SELECT * FROM repos WHERE registry>"bad operator"`)
            chai.expect(res.code).to.eql(400) // Error if get to here
        } catch (err) {
            chai.expect(err.code).to.eql(400)
            chai.expect(err.message).to.eql(`WHERE for "Repos" may only filter by "Registry", "Host" and "Namespace".`)
        }
    })

    it('Simple select repos from authenticated registry', async () => {
        const res = await dockerql.query(`SELECT * FROM repos WHERE registry = "my-dockerhub" and namespace = "simplycoders"`)
        chai.expect(res.code).to.eql(200)
        chai.expect(res.data.length).to.eql(2)
        chai.expect(res.data[0]).to.eql({
            registry: 'my-dockerhub',
            host: 'hub.docker.com',
            namespace: 'simplycoders',
            repo: 'dockerql',
            description: 'A read-only SQL-like interface for docker registries. ',
            isPrivate: false,
            pulls: 125,
            stars: 0,
            updated: '2021-04-03T03:59:10.208553Z'
        })
    })

})
