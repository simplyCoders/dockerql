import * as fs from 'fs'

// ----------------------------------------------
// read .registries.json configurations
// ----------------------------------------------
let configJson = { registries: [] }
if (typeof (process.env.DOCKERQL_CONF) !== 'undefined') {
  configJson = JSON.parse(process.env.DOCKERQL_CONF)
  console.info(`Info. Config taken from env DOCKERQL_CONF`)
} else {
  const configFile = process.env.DOCKERQL_FILE || '~/.dockerql/config.json'
  if (fs.existsSync(configFile)) {
    configJson = JSON.parse(fs.readFileSync(configFile).toString())
    console.info(`Info. Config taken from file ${configFile}`)
  } else {
    console.warn(`Warning. Config file does not exists. Operating with default access to anonymous dockerhub. File: ${configFile}`)
  }
}

// validate registry conf
if (typeof (configJson.registries) === 'undefined'
  || configJson.registries.length === 0
) {
  console.warn(`Warning. Config JSON is not right. Operating with default access to anonymous dockerhub. JSON: ${JSON.stringify(configJson)}`)
}

// ----------------------------------------------
// get environment variables
// ----------------------------------------------
export const env = process.env.NODE_ENV || 'production'
const verbose = typeof (process.env.VERBOSE) !== 'undefined' || false
export const loglevel = verbose ? 1 : 0

// ----------------------------------------------
// exports
// ----------------------------------------------
export const registries = configJson.registries

// ----------------------------------------------
// print configuration highlights
// ----------------------------------------------
export const echo = () => {
  console.info('Environment:', `'${env}'`)
  console.info('Registries count:', registries.length)
  console.info('--------------------------------------------------')
}
