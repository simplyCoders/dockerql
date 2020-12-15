"use strict"
import axios from "axios"

import { context } from "./context"

// perform get all tags
export const getNamespaces = async (where:any): Promise<any[]> => {
    // make sure there is no where expression for the namespace query
    if (where!==null) {
        throw ({message: "Query the \"Namespaces\" table does not support the WHERE clause."})
    }
    const endpoint = context.host + "repositories/namespaces/"
    const resp = await axios.get(endpoint,
        {
            headers: {
                authorization: "Bearer " + context.token
            }
        })
    const records: any[] = []
    for (const namespace of resp.data.namespaces) {
        records.push({ "namespace": namespace })
    }
    console.log("Get namespaces successfull. Count:", records.length)
    return records
}
