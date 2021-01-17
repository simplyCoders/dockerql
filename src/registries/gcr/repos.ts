import axios from 'axios'
import { verbose } from '../../config'

// perform get all repos
export const getRepos = async (context: any, host: string, namespace: string): Promise<any[]> => {
  // need to generate a new token with different scope
  const endpointGetToken = `https://${host}/v2/token?scope=repository:${namespace}/catalog:*&service=${host}`
  const data = {
    username: '_json_key',
    password: JSON.stringify(context.password),
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
        registry: context.name,
        host,
        namespace,
        repo: name,
      })
    })

    verbose(`Get repos successfull. Count:${records.length}`)
    return records
  } catch (err) {
    console.error(JSON.stringify(err).substr(0, 800))
    throw (err)
  }
}
