import * as express from 'express'
import * as dockerql from "dockerql"

import * as config from "./config"

// ----------------------------------------------
// Init all registries defined in .registry.json
// ----------------------------------------------
export const init = async () => {
  // setup the dockerql option, for now this means loglevel
  dockerql.init({ loglevel: config.loglevel })

  try {
    // connect to a registry, in this case dockerhub with anonymous access
    await dockerql.connect({ name: "dockerhub", type: "dockerhub" })

    for (let i = 0; i < config.registries.length; i += 1) {
      await dockerql.connect(config.registries[i] as dockerql.Registry)
    }
  } catch (err) {
    console.log("Error ", err)
  }
}

// ----------------------------------------------
// execute the dockerql query
// ----------------------------------------------
export const query = async (req: express.Request, res: express.Response) => {
  // Get the query parameter
  const { sql } = req.query
  if (typeof (sql) === 'undefined') {
    res.status(400)
    res.json({ code: 400, message: 'Expected a "sql" query parameter.' })
    return
  }

  try {
    const rsp = await dockerql.query(sql.toString())

    // Publish the result set
    res.status(200)
    res.json({
      code: 200,
      message: 'Query executed successfully.',
      count: rsp.data.length,
      data: rsp
    })
  } catch (err) {
    console.error(err.message)
    res.status(err.code)
    res.json({ code: err.code, message: err.message })
  }
}
