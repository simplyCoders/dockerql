import express from 'express'
import cors from 'cors'
import figlet from 'figlet'

import * as config from './config'
import * as dockerqlInterface from './dockerql-interface'

// ----------------------------------------------
// Print banner
// ----------------------------------------------
console.info(figlet.textSync('dockerql'))
config.echo()

dockerqlInterface.init()

  // ----------------------------------------------
  // Main server rounter
  // ----------------------------------------------
  export const server = () => {
    const app = express()

    // Setup CORS restrictions
    const corsOptions: cors.CorsOptions = {
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
    app.use(cors(corsOptions))

    // Define a route handlers for the APIs
    app.get('/v1/query', dockerqlInterface.query)
    return app
  }

  // ----------------------------------------------
  // Start the server (if this is not a test mode)
  // ----------------------------------------------
  if (config.env !== 'test') {
    const port = process.env.PORT || 8080 // default port to listen
    const app = server()
    app.listen(port, () => {
      console.info(`Listening to requests on port:${port}`)
    })
  }
