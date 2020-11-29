"use strict"
import express from "express"
import cors from "cors"
import figlet from "figlet"

import { query } from "./endpoints/query"
import * as config from "./config"

// Main server rounter
export const server = () => {
    const app = express()

    // Setup CORS restrictions
    const corsOptions: cors.CorsOptions = {
        origin: "*",
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
    app.use(cors(corsOptions))


    // Define a route handlers for the APIs
    app.get("/v1/query", query)
    return app
}

// Print banner
console.log(figlet.textSync("KubeQuery"))
config.echo()

// Start the server if not in test mode
if (config.env !== "test") {
    const port = process.env.PORT || 8080 // default port to listen
    const app = server()
    app.listen(port, () => {
        console.log(`Listening to requests on port:${port}`)
    })
}