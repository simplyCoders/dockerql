"use strict"
import axios from "axios"

// perform get images
export const getImages = async (context: any, namespace: string, repo: string): Promise<any[]> => {

    const endpoint = context.host + "repositories/" + namespace + "/" + repo + "/tags/"
    const records = []
    try {
        let nextEndpoint = endpoint
        while (nextEndpoint !== null) {
            const resp = await axios.get(nextEndpoint,
                {
                    headers: {
                        authorization: "Bearer " + context.token
                    }
                })

            for (const manifest of resp.data.results) {
                records.push({
                    "registry": context.name,
                    "namespace": namespace,
                    "repo": repo,
                    "digest": manifest.images.length === 0 ? "" : manifest.images[0].digest,
                    "tag": manifest.name,
                    "size": manifest.full_size,
                    "created": manifest.tag_last_pushed,
                    "pushed": manifest.tag_last_pushed,
                    "pulled": manifest.tag_last_pulled
                })
            }

            nextEndpoint = resp.data.next
            if (nextEndpoint !== null) {
                console.log("Fetch additional page.")
            }
        }
        console.log("Get images successfull. Count:", records.length)
        return records
    } catch (err) {
        console.error(JSON.stringify(err).substr(0, 800))
        throw (err)
    }
}
