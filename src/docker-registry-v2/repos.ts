"use strict"
import axios from "axios"

import { Context } from "./context"

// perform get all repos
export const getRepos = async (where: any): Promise<any[]> => {

    // where clause analysis
    if (where===null) {
        throw ({message: "Query the \"Repos\" table must include a WHERE clause in the form: WHERE namespace = \"{{namespace}}\"."})
    }

    if (where.operator!=="=") {
        throw ({message: "Query the \"Repos\" table must include a WHERE clause in the form: WHERE namespace = \"{{namespace}}\"."})
    }

    if ((typeof(where.left.column)==="undefined" && typeof(where.right.column)==="undefined")
    || (typeof(where.left.column)!=="undefined" && where.left.column.toLowerCase()!=="namespace")
    || (typeof(where.right.column)!=="undefined" && where.right.column.toLowerCase()!=="namespace")) {
        throw ({message: "Query the \"Repos\" table must include a WHERE clause in the form: WHERE namespace = \"{{namespace}}\"."})
    }

    const namespace = (where.left.type==="string") ? where.left.value : where.right.value
    const endpoint = Context.baseEndpoint + "repositories/" + namespace + "/"

    try {
        const resp = await axios.get(endpoint,
            {
                headers: {
                    authorization: "Bearer " + Context.token
                }
            })
        const records = resp.data.results
        console.log("Get repos successfull. Count:", records.length)
        return records
    } catch (err) {
        console.error(err)
        throw (err)
    }
}
