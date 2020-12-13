"use strict"
import axios from "axios"

import { Context } from "./context"

// Get a simple where clause and extract column name and value
const getColumnValue = (where: any, message: string) => {
    if (where===null) {
        throw ({message})
    }

    if (where.operator!=="=") {
        throw ({message})
    }

    if ((typeof(where.left.column)==="undefined" && typeof(where.right.column)==="undefined")
    || (typeof(where.left.column)!=="undefined" && where.left.column.toLowerCase()!=="namespace" && where.left.column.toLowerCase()!=="repo")
    || (typeof(where.right.column)!=="undefined" && where.right.column.toLowerCase()!=="namespace" && where.right.column.toLowerCase()!=="repo")) {
        throw ({message})
    }

    const column = (where.left.type==="column_ref") ? where.left.column : where.right.column
    const value = (where.left.type==="string") ? where.left.value : where.right.value

    return {column, value}
}



// perform get all tags
export const getTags = async (where: any): Promise<any[]> => {

    // where clause analysis
    if (where===null) {
        throw ({message: "Query the \"Tags\" table must include a WHERE clause in the form: WHERE namespace = \"{{namespace]}}\" AND repo = \"{{repo}}\"."})
    }

    if (where.operator!=="AND"
    || typeof(where.left.operator)==="undefined"
    || where.left.operator!=="="
    || typeof(where.right.operator)==="undefined"
    || where.right.operator!=="="
    ) {
        throw ({message: "Query the \"Tags\" table must include a WHERE clause in the form: WHERE namespace = \"{{namespace]}}\" AND repo = \"{{repo}}\"."})
    }

    const left = getColumnValue (where.left,"Query the \"Repos\" table must include a WHERE clause in the form: WHERE namespace = \"{{namespace]}}\".")
    const right =  getColumnValue (where.right,"Query the \"Repos\" table must include a WHERE clause in the form: WHERE namespace = \"{{namespace]}}\".")

    if (left.column===right.column) {
        throw ({message: "Query the \"Tags\" table must include a WHERE clause in the form: WHERE namespace = \"{{namespace}}\" AND repo = \"{{repo}}\"."})
    }

    const namespace = (left.column==="namespace") ? left.value : right.value
    const repo = (left.column==="repo") ? left.value : right.value

    const endpoint = Context.baseEndpoint + "repositories/" + namespace + "/" + repo + "/tags/"

    try {
        const resp = await axios.get(endpoint,
            {
                headers: {
                    authorization: "Bearer " + Context.token
                }
            })
        const records = resp.data.results
        console.log("Get tags successfull. Count:", records.length)
        return records
    } catch (err) {
        console.error(err)
        throw (err)
    }
}
