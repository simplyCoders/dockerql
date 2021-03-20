import axios from 'axios'

import { iSession } from '../types'

// ----------------------------------------------
// perform get all repos
// ----------------------------------------------
export const getRepos = async (session: iSession, host: string, namespace: string): Promise<any[]> => {
  // need to generate a new token with different scope
  const endpointGetToken = `https://${host}/v2/token?scope=repository:${namespace}/catalog:*&service=${host}`
  const data = {
    username: '_json_key',
    password: JSON.stringify(session.custom.password),
  }
  const endpoint = `https://${host}/v2/_catalog`

  try {
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
    resp.data.repositories.forEach((name: string) => {
      records.push({
        registry: session.registry,
        host,
        namespace,
        repo: name,
      })
    })

    return records
  } catch (err) {
    throw new Error(JSON.stringify(err).substr(0, 800))
  }
}
