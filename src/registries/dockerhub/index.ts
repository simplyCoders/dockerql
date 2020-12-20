"use strict"
import axios from "axios"

export * from "./repos"
export * from "./images"

export const type = "dockerhub"

export const init = async (config:any): Promise<any> => {
    const data = {
        "username": config.username,
        "password": config.password
    }

    try {
        const host = "https://hub.docker.com/v2/"
        const resp = await axios.post(host + "users/login/", data)
        const token = resp.data.token
        const context = {"type": type, "name": config.name, "host": host, "username": config.username, "namespace": config.namespace, "token": token}

        console.log("Authenticated successfully to " + config.name + " (type: " + type +")")
        console.log("Host:", context.host)
        console.log("User:", config.username)

        return context
    } catch (err) {
        console.error(JSON.stringify(err).substr(0,800))
        return
    }
}

