"use strict"
import axios from "axios"
import validUrl from "valid-url"

import * as config from "../config"
import { Context } from "./context"

// perform authentication for dockerhub
const authDockerRegistryV2 = async (endpoint:string) => {
    Context.setBaseEndpoint(endpoint)
    Context.setUsername(config.auth.username)
    const data = {
        "username": config.auth.username,
        "password": config.auth.password
    }

    try {
    const resp = await axios.post(endpoint+"users/login/",data)
    Context.setToken(resp.data.token)
    console.log ("Authenticated successfully to a docker registry v2")
    console.log ("Base endpoint:",Context.baseEndpoint)
    console.log ("User:", config.auth.username)
    console.log ("Token:", Context.token)
    } catch (err) {
        console.error (err)
        return
    }
}

// perform authentication and save token
export const init = async () => {

    // validate docker registry config
    const type = config.auth.type.toLowerCase()
    if (type!=="dockerv2") {
        console.log ("ERROR! Docker registry config file includes unsupported registry type.")
        return
    }

    let endpoint = (typeof(config.auth.endpoint)!=="undefined") ? config.auth.endpoint : "https://hub.docker.com/v2/"
    if (endpoint.lastIndexOf('/') !== endpoint.length - 1) { // add "/" at the end of the string if not already there.
        endpoint += "/"
    }
    if (!validUrl.isWebUri(config.auth.endpoint)) {
        console.error ("ERROR! Docker registry config file endpoint is not a valid uri.")
        return
    }

    await authDockerRegistryV2 (endpoint)
}

