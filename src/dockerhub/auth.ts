"use strict"
import axios from "axios"

import { context } from "./context"

// perform authentication for dockerhub
export const login = async (username: string, password: string) => {
    context.setUsername(username)
    const data = {
        "username": username,
        "password": password
    }

    try {
        const resp = await axios.post(context.host + "users/login/", data)
        context.setToken(resp.data.token)
        console.log("Authenticated successfully to dockerhub")
        console.log("Host:", context.host)
        console.log("User:", username)
        console.log("Token:", context.token)
    } catch (err) {
        console.error(err)
        return
    }
}
