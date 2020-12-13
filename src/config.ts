// Auto-detect configuration
import * as fs from "fs"

export const env = process.env.NODE_ENV || "production"

const authConfigFile = process.env.DOCKER_REGISTRY_CONFIG_FILE || "./docker-registry-config.json"
export const auth = typeof(process.env.DOCKER_REGISTRY_CONFIG)!=="undefined"
                    ? JSON.parse(process.env.DOCKER_REGISTRY_CONFIG)
                    : JSON.parse(fs.readFileSync(authConfigFile).toString())

export const echo = () => {
    console.log("Environment:", "'"+env+"'")
    console.log("docker-registry-conf:", "'"+authConfigFile+"'")
    console.log("docker-registry-type:", "'" + auth.type as string+"'")
}
