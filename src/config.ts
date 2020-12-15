// Auto-detect configuration
import * as fs from "fs"

// Load supported registries
import * as dockerhub from "./dockerhub"

export const env = process.env.NODE_ENV || "production"

// read configuration file (only one registry is supported per instance of dockerQL)
const configFile = process.env.DOCKER_REGISTRY_CONFIG_FILE || "./docker-registry-config.json"

const registryConf = typeof (process.env.DOCKER_REGISTRY_CONFIG) !== "undefined"
    ? JSON.parse(process.env.DOCKER_REGISTRY_CONFIG)
    : JSON.parse(fs.readFileSync(configFile).toString())

// registry data model
const registryTypes: Map<string, any> = new Map([
    [dockerhub.type, dockerhub]
])
export const registry = registryTypes.get(registryConf.type)

// database schema
export const tables: Map<string, (parm?: string) => Promise<string[]>> = new Map([
    ["namespaces", registry.getNamespaces],
    ["repos", registry.getRepos],
    ["tags", registry.getTags],
    ["whoami", registry.whoAmI]
])

// print configuration settings
export const echo = () => {
    console.log("Environment:", "'" + env + "'")
    console.log("config file:", "'" + configFile + "'")
    console.log("registry type:", "'" + registry.type as string + "'")
}

// init the registry as defined in the config file
export const init = () => {
    echo()

    // validate docker registry config
    const type = registryConf.type.toLowerCase()
    if (!registryTypes.has(type)) {
        console.log("ERROR! Docker registry config file includes unsupported registry type.")
        return
    }

    registryTypes.get(registry.type).init(registryConf.username, registryConf.password)
}
