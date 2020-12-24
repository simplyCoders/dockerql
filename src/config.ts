// Auto-detect configuration
import * as fs from "fs"

export const env = process.env.NODE_ENV || "production"

// read .registries configurations
const defaultRegistryConf = {"default-registry":"dockerhub","registries":[{"name":"dockerhub", "type":"dockerhub","defaultNamespace":"docker","username":"","password":""}]}
export let registryConf = defaultRegistryConf
if (typeof (process.env.DOCKER_REGISTRIES) !== "undefined") {
    registryConf = JSON.parse(process.env.DOCKER_REGISTRIES)
} else {
    const configFile = process.env.DOCKER_REGISTRIES_FILE || "./registries.json"
        if (fs.existsSync(configFile)) {
            registryConf = JSON.parse(fs.readFileSync(configFile).toString())
        } else {
            console.warn("Warning. Config file does not exists. Using annonymous access to dockerhub instead. File: "+configFile)
            registryConf = defaultRegistryConf
        }
}

// validate registry conf
if (typeof(registryConf.registries)==="undefined"
||  registryConf.registries.length===0
) {
    console.warn("Warning. Registry conf is not right. Using annonymous access to dockerhub instead.")
    registryConf = defaultRegistryConf
}

// export content of registry configuration
export const registries = registryConf.registries
export const defaultRegistry = (typeof(registryConf["default-registry"])!=="undefined") ? registryConf["default-registry"] : registryConf.registries[0].name

// print configuration settings
export const echo = () => {
    console.log("Environment:", "'" + env + "'")
    console.log("Registries count:", registries.length)
}
