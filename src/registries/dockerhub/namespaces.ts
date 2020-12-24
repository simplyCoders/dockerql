"use strict"
import axios from "axios"

// perform get all namespaces
export const getNamespaces = async (context: any): Promise<any[]> => {

    if (context.token === "") // if this is anonymous user then return empty list
        return []

    const endpoint = context.host + "repositories/namespaces/"
    try {
        const resp = await axios.get(endpoint,
            {
                headers: {
                    authorization: "Bearer " + context.token
                }
            })
        const records = []
        for (const namespace of resp.data.namespaces) {
            records.push({
                "registry": context.name,
                "namespace": namespace
            })
        }

        console.log("Get repos successfull. Count:", records.length)
        return records
    } catch (err) {
        console.error(JSON.stringify(err).substr(0, 800))
        throw (err)
    }
}
