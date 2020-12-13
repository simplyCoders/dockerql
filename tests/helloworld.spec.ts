import * as chai from "chai"
import request from "supertest"
import nock from "nock"

import { server } from "../src/index"

const app = server()

describe("GET /v1/helloworld", () => {
    it("With no id", async () => {
        const res = await request(app).get("/v1/helloworld")
        chai.expect(res.status).to.eql(200)
        chai.expect(res.body).be.a("object")
        chai.expect(res.body["message"]).to.eql("Hello World!")
    })

    it("With id", async () => {
        const res = await request(app).get("/v1/helloworld/my-id")
        chai.expect(res.status).to.eql(200)
        chai.expect(res.body).be.a("object")
        chai.expect(res.body["message"]).to.eql("Hello World with id!")
        chai.expect(res.body["id"]).to.eql("my-id")
    })
})