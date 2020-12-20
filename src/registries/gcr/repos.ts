"use strict"
import axios from "axios"

// perform get all repos
export const getRepos = async (context:any): Promise<any[]> => {

    const endpoint = "https://" + context.namespace + "/v2/_catalog"

    try {
        const resp = await axios.get(endpoint,
            {
                headers: {
                    authorization: "Bearer " + context.token
                }
            })
        const records = []
        for (const name of resp.data.repositories) {
            records.push ({
                "registry": context.name,
                "repo": name,
                "description": "", // no access to the description
                "isPrivate": true, // gcr repos are assumed private
                "updated": "" // no access to the last update
            })
        }
        console.log("Get repos successfull. Count:", records.length)
        return records
    } catch (err) {
        console.error(JSON.stringify(err).substr(0,800))
        throw (err)
    }
}
