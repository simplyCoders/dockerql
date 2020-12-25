import express from 'express'
import cors from 'cors'
import figlet from 'figlet'
import consoleStamp from 'console-stamp'

import * as config from './config'
import { query } from './endpoints/query'
import * as registries from './registries'

// ----------------------------------------------
// Setup console to include timestamp
// ----------------------------------------------
consoleStamp(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' })

// ----------------------------------------------
// Print banner
// ----------------------------------------------
console.info(figlet.textSync('dockerql'))
config.echo()

// ----------------------------------------------
// Init all registries defined in .registry.json
// ----------------------------------------------
registries.init(config)

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
  app.get('/v1/query', query)
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
