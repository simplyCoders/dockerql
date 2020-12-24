"use strict"
import axios from "axios"

// perform get all namespaces
export const getNamespaces = async (context: any): Promise<any[]> => {

    const records = [
        { "registry": context.name, "namespace": "gcr.io" },
        { "registry": context.name, "namespace": "us.gcr.io" },
        { "registry": context.name, "namespace": "eu.gcr.io" },
        { "registry": context.name, "namespace": "asia.gcr.io" },
    ]
    console.log("Get repos successfull. Count:", records.length)
    return records
}
