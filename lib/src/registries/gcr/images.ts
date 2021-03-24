import axios from 'axios'

import { iSession } from '../types'

// ----------------------------------------------
// perform get images
// ----------------------------------------------
export const getImages = async (
  session: iSession,
  host: string,
  namespace: string,
  repo: string,
): Promise<any[]> => {
  // need to generate a new token with different scope
  const endpointGetToken = `https://${host}/v2/token?scope=repository:${namespace}/${repo}:pull&service=${host}`
  const data = {
    username: '_json_key',
    password: JSON.stringify(session.custom.password),
  }

  const endpoint = `https://${host}/v2/${namespace}/${repo}/tags/list`

  // generate new token for scope
  const respGetToken = await axios.get(endpointGetToken, { auth: data })
  const tempToken = respGetToken.data.token
  // get the data
  const resp = await axios.get(endpoint,
    {
      headers: {
        authorization: `Bearer ${tempToken}`,
      },
    })
  const records: any[] = []
  Object.keys(resp.data.manifest).forEach((digest) => {
    const manifest = resp.data.manifest[digest]
    records.push({
      registry: session.registry,
      host,
      namespace,
      repo,
      digest,
      tags: manifest.tag,
      size: manifest.imageSizeBytes,
      created: new Date(parseInt(manifest.timeCreatedMs, 10)).toISOString(),
      pushed: new Date(parseInt(manifest.timeUploadedMs, 10)).toISOString(),
    })
  })
  return records
}
