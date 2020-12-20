"use strict"
import axios from "axios"

// perform get images
export const getImages = async (context: any, repo: string): Promise<any[]> => {

    // need to generate a new token with different scope
    const endpointGetToken = "https://" + context.namespace + "/v2/token?scope=repository:" + context.jsonkey.project_id + "/" + repo + ":pull&service=" + context.namespace
    const data = {
        "username": "_json_key",
        "password": JSON.stringify(context.jsonkey)
    }

    const endpoint = "https://" + context.namespace + "/v2/" + context.jsonkey.project_id + "/" + repo + "/tags/list"

    try {
        // generate new token for scope
        const respGetToken = await axios.get(endpointGetToken, { auth: data })
        const tempToken = respGetToken.data.token
        // get the data
        const resp = await axios.get(endpoint,
            {
                headers: {
                    authorization: "Bearer " + tempToken
                }
            })
        const records = []
        for (const digest of Object.keys(resp.data.manifest)) {
            const manifest = resp.data.manifest[digest]
            records.push ({
                "registry": context.name,
                "repo": repo,
                "digest": digest,
                "tag": manifest.tag.length===0 ? "" : manifest.tag[0],
                "size": manifest.imageSizeBytes,
                "created": new Date(parseInt(manifest.timeCreatedMs,10)).toISOString(),
                "pushed": new Date(parseInt(manifest.timeUploadedMs,10)).toISOString(),
                "pulled": "" // gcr does not report last read time
            })
        }
        console.log("Get images successfull. Count:", records.length)
        return records
    } catch (err) {
        console.error(JSON.stringify(err).substr(0, 800))
        throw (err)
    }
}
