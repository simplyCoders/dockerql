// Auto-detect configuration
import * as fs from "fs"

export const env = process.env.NODE_ENV || "production"

// read .registries configurations
export let registryConf = {"registries":[{"name":"annonymous-dockerhub", "type":"dockerhub","namespace":"docker","username":"","password":""}]}
if (typeof (process.env.DOCKER_REGISTRIES) !== "undefined") {
    registryConf = JSON.parse(process.env.DOCKER_REGISTRIES)
} else {
    const configFile = process.env.DOCKER_REGISTRIES_FILE || "./registries.json"
        if (fs.existsSync(configFile)) {
            registryConf = JSON.parse(fs.readFileSync(configFile).toString())
        } else {
            console.warn("Warning. Config file does not exists. Using annonymous access to dockerhub instead. File: "+configFile)
        }
}
export const registries = registryConf.registries

// print configuration settings
export const echo = () => {
    console.log("Environment:", "'" + env + "'")
    console.log("Registries count:", registries.length)
}
