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
        .get('/v2/repositories/simplycoders/dockerql/tags/')
        .reply(200,
            {
                "count": 3,
                "next": null,
                "previous": null,
                "results": [
                    {
                        "creator": 913273,
                        "id": 131382490,
                        "image_id": null,
                        "images": [
                            {
                                "architecture": "amd64",
                                "features": "",
                                "variant": null,
                                "digest": "sha256:4aaddecfab0e68c7004b1949185c0511acf582cdb7ba6cb11296298126e4283e",
                                "os": "linux",
                                "os_features": "",
                                "os_version": null,
                                "size": 139502656,
                                "status": "active",
                                "last_pulled": "2021-04-05T00:40:42.097156Z",
                                "last_pushed": "2021-04-03T03:59:09.872923Z"
                            }
                        ],
                        "last_updated": "2021-04-03T03:59:08.941211Z",
                        "last_updater": 913273,
                        "last_updater_username": "ezborgy",
                        "name": "latest",
                        "repository": 10556010,
                        "full_size": 139502656,
                        "v2": true,
                        "tag_status": "active",
                        "tag_last_pulled": "2021-04-05T00:40:42.097156Z",
                        "tag_last_pushed": "2021-04-03T03:59:08.941211Z"
                    },
                    {
                        "creator": 913273,
                        "id": 144139178,
                        "image_id": null,
                        "images": [
                            {
                                "architecture": "amd64",
                                "features": "",
                                "variant": null,
                                "digest": "sha256:4aaddecfab0e68c7004b1949185c0511acf582cdb7ba6cb11296298126e4283e",
                                "os": "linux",
                                "os_features": "",
                                "os_version": null,
                                "size": 139502656,
                                "status": "active",
                                "last_pulled": "2021-04-05T00:40:42.097156Z",
                                "last_pushed": "2021-04-03T03:59:09.872923Z"
                            }
                        ],
                        "last_updated": "2021-04-03T03:59:09.872923Z",
                        "last_updater": 913273,
                        "last_updater_username": "ezborgy",
                        "name": "0.1.8",
                        "repository": 10556010,
                        "full_size": 139502656,
                        "v2": true,
                        "tag_status": "active",
                        "tag_last_pulled": "2021-04-05T00:40:42.097156Z",
                        "tag_last_pushed": "2021-04-03T03:59:09.872923Z"
                    },
                    {
                        "creator": 913273,
                        "id": 143693360,
                        "image_id": null,
                        "images": [
                            {
                                "architecture": "amd64",
                                "features": "",
                                "variant": null,
                                "digest": "sha256:2fbe4b58eb128e6fca7a8c151975a3f8e299c690c6471b109e6ed0f3c64040b3",
                                "os": "linux",
                                "os_features": "",
                                "os_version": null,
                                "size": 139427016,
                                "status": "active",
                                "last_pulled": "2021-04-05T00:40:42.150956Z",
                                "last_pushed": "2021-03-31T03:31:49.229455Z"
                            }
                        ],
                        "last_updated": "2021-03-31T03:31:49.229455Z",
                        "last_updater": 913273,
                        "last_updater_username": "ezborgy",
                        "name": "0.1.7",
                        "repository": 10556010,
                        "full_size": 139427016,
                        "v2": true,
                        "tag_status": "active",
                        "tag_last_pulled": "2021-04-05T00:40:42.150956Z",
                        "tag_last_pushed": "2021-03-31T03:31:49.229455Z"
                    }
                ]
            })
}

// ----------------------------------------------
// Test dockerhub
// ----------------------------------------------
describe('Test dockerhub images.', () => {
    nockDockerHub('myuser', 'right password', 'wrong password', 'thisistheabcsimplefaketoken')

    it('Connect using good credentials', async () => {
        // setup the dockerql option, for now this means loglevel
        dockerql.init({ loglevel: dockerql.LogLevels.NoLogging })
        await dockerql.connect({ name: "dockerhub", type: "dockerhub" })
        await dockerql.connect({ name: "my-dockerhub", type: "dockerhub", username: "myuser", password: "right password" })
    })

    it('Select from images with bad WHERE (error)', async () => {
        try {
            const res = await dockerql.query(`SELECT * FROM images WHERE pulls="abc"`)
            chai.expect(res.code).to.eql(400) // Error if get to here
        } catch (err) {
            chai.expect(err.code).to.eql(400)
            chai.expect(err.message).to.eql(`WHERE for "Images" must filter by "Repo", and may filter by "Registry", "Host" and "Namespace".`)
        }
    })

    it('Select from images with bad registry name (error)', async () => {
        try {
            const res = await dockerql.query(`SELECT * FROM images WHERE registry="bad name" and repo="bad repo"`)
            chai.expect(res.code).to.eql(400) // Error if get to here
        } catch (err) {
            chai.expect(err.code).to.eql(400)
            chai.expect(err.message).to.eql(`WHERE clause includes unknown registry name "bad name".`)
        }
    })

    it('Select from images whiout where repo (error)', async () => {
        try {
            const res = await dockerql.query(`SELECT * FROM images WHERE registry="my-dockerhub"`)
            chai.expect(res.code).to.eql(400) // Error if get to here
        } catch (err) {
            chai.expect(err.code).to.eql(400)
            chai.expect(err.message).to.eql(`WHERE for "Images" must filter by "Repo", and may filter by "Registry", "Host" and "Namespace".`)
        }
    })

    it('Select from images with bad where operator (error)', async () => {
        try {
            const res = await dockerql.query(`SELECT * FROM images WHERE registry="my-dockerhub" and repo>"abc"`)
            chai.expect(res.code).to.eql(400) // Error if get to here
        } catch (err) {
            chai.expect(err.code).to.eql(400)
            chai.expect(err.message).to.eql(`WHERE for "Images" must filter by "Repo", and may filter by "Registry", "Host" and "Namespace".`)
        }
    })

    it('Simple select images from authenticated registry', async () => {
        const res = await dockerql.query(`SELECT registry, namespace, repo, digest, tags, size FROM images WHERE registry = "my-dockerhub" and namespace = "simplycoders" and repo="dockerql"`)
        chai.expect(res.code).to.eql(200)
        chai.expect(res.data.length).to.eql(3)
        chai.expect(res.data[0]).to.eql({
            registry: "my-dockerhub",
            namespace: "simplycoders",
            repo: "dockerql",
            digest: "sha256:4aaddecfab0e68c7004b1949185c0511acf582cdb7ba6cb11296298126e4283e",
            tags: ["latest"],
            size: 139502656
        })
    })

})
