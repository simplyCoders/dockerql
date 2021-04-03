import * as chai from 'chai'
import { describe, it } from 'mocha'

import * as dockerql from '../src'

// ----------------------------------------------
// Run basic tests
// ----------------------------------------------
describe('Test dockerql.connect().', async () => {

    it('Prepare the dockerql envrionment', async () => {
        // setup the dockerql option, for now this means loglevel
        dockerql.init()
    })

    it('Registry as string (error)', async () => {
        try {
            // @ts-expect-error
            await dockerql.connect("not-a-registry")
            chai.expect(0).to.eql(400) // Error if get to here
        } catch (err) {
            chai.expect(err.code).to.eql(400)
            chai.expect(err.message).to.eql(`Invalid Registry parameter was provided.`)
        }
    })

    it('Registry without name (error)', async () => {
        try {
            // @ts-expect-error
            await dockerql.connect({ type: "dockerhub" })
            chai.expect(0).to.eql(400) // Error if get to here
        } catch (err) {
            chai.expect(err.code).to.eql(400)
            chai.expect(err.message).to.eql(`A registry must include a name.`)
        }
    })

    it('Registry with name as number (error)', async () => {
        try {
            // @ts-expect-error
            await dockerql.connect({ name: 1 })
            chai.expect(0).to.eql(400) // Error if get to here
        } catch (err) {
            chai.expect(err.code).to.eql(400)
            chai.expect(err.message).to.eql(`A registry must include a name.`)
        }
    })

    it('Registry without type (error)', async () => {
        try {
            // @ts-expect-error
            await dockerql.connect({ name: "dockerhub" })
            chai.expect(0).to.eql(400) // Error if get to here
        } catch (err) {
            chai.expect(err.code).to.eql(400)
            chai.expect(err.message).to.eql(`A registry must include a type.`)
        }
    })

    it('Registry with type as number (error)', async () => {
        try {
            // @ts-expect-error
            await dockerql.connect({ name: "dockerhub", type: 1 })
            chai.expect(0).to.eql(400) // Error if get to here
        } catch (err) {
            chai.expect(err.code).to.eql(400)
            chai.expect(err.message).to.eql(`A registry must include a type.`)
        }
    })

    it('Registry with invalid type (error)', async () => {
        try {
            await dockerql.connect({ name: "dockerhub", type: "not-a-type" })
            chai.expect(0).to.eql(400) // Error if get to here
        } catch (err) {
            chai.expect(err.code).to.eql(400)
            chai.expect(err.message).to.eql(`"not-a-type" is an unsupported registry type.`)
        }
    })

    it('Success to connect to dockethub', async () => {
        try {
            const res = await dockerql.connect({ name: "dockerhub", type: "dockerhub" })
            chai.expect(res.code).to.eql(200)
            chai.expect(res.message).to.eql(`Ok, connected successfully.`)
        } catch (err) {
            chai.expect(err.code).to.eql(200) // Error if get to here
        }
    })

    it('Duplicate registry name (error)', async () => {
        try {
            const res = await dockerql.connect({ name: "dockerhub", type: "dockerhub" })
            chai.expect(res.code).to.eql(400) // Error if get to here
        } catch (err) {
            chai.expect(err.code).to.eql(400)
            chai.expect(err.message).to.eql(`A registry with name "dockerhub" already exists.`)
        }
    })
})
