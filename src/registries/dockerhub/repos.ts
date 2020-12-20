"use strict"
import axios from "axios"

// perform get all repos
export const getRepos = async (context: any): Promise<any[]> => {

    const endpoint = context.host + "repositories/" + context.namespace + "/"
    try {
        const resp = await axios.get(endpoint,
            {
                headers: {
                    authorization: "Bearer " + context.token
                }
            })
        const records = []
        for (const repo of resp.data.results) {
            records.push ({
                "registry": context.name,
                "repo": repo.name,
                "description": repo.description,
                "isPrivate": repo.is_private,
                "updated": repo.last_updated
            })
        }

        console.log("Get repos successfull. Count:", records.length)
        return records
    } catch (err) {
        console.error(JSON.stringify(err).substr(0,800))
        throw (err)
    }
}
