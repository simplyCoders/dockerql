"use strict"
import axios from "axios"

export * from "./namespaces"
export * from "./repos"
export * from "./images"

export const type = "dockerhub"

export const init = async (config:any): Promise<any> => {
    const host = "https://hub.docker.com/v2/"

    const namespace = (typeof(config.namespace)!=="undefined") ? config.namespace
                    : (typeof(config.username)!=="undefined" && config.username!=="") ? config.username : "docker"

    if (typeof(config.username)==="undefined" || config.username==="") {
        console.log("Annonymous dockerhub access, namespace:",namespace)
        const context = {"type": type, "name": config.name, "host": host, "namespace": namespace, "token": ""}
        return context
    }

    const data = {
        "username": config.username,
        "password": config.password
    }

    try {
        const resp = await axios.post(host + "users/login/", data)
        const token = resp.data.token
        const context = {"type": type, "name": config.name, "host": host, "username": config.username, "namespace": namespace, "token": token}

        console.log("Authenticated successfully to " + config.name + " (type: " + type +")")
        console.log("Namespace:", namespace)
        console.log("User:", config.username)

        return context
    } catch (err) {
        console.error(JSON.stringify(err).substr(0,800))
        return
    }
}

