// Auto-detect configuration
import * as fs from "fs"

export const env = process.env.NODE_ENV || "production"

// read configuration file (only one registry is supported per instance of dockerQL)
const configFile = process.env.DOCKER_REGISTRIES_FILE || "./registries.json"

export const registries = typeof (process.env.DOCKER_REGISTRIES) !== "undefined"
    ? JSON.parse(process.env.DOCKER_REGISTRIES)
    : JSON.parse(fs.readFileSync(configFile).toString())

// print configuration settings
export const echo = () => {
    console.log("Environment:", "'" + env + "'")
    console.log("config file:", "'" + configFile + "'")
}
