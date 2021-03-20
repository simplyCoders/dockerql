import axios from 'axios'

import { iSession } from '../types'

// ----------------------------------------------
// perform get all namespaces
// ----------------------------------------------
export const getNamespaces = async (session: iSession, host: string): Promise<any[]> => {
  if (session.token === '') { // if this is anonymous user then return empty list
    return [session.namespace]
  }

  const endpoint = `https://${host}/v2/repositories/namespaces/`
  try {
    const resp = await axios.get(endpoint,
      {
        headers: {
          authorization: `Bearer ${session.token}`,
        },
      })
    const records:any[] = []
    resp.data.namespaces.forEach((namespace: string) => {
      records.push({
        registry: session.registry,
        host,
        namespace,
      })
    })

    return records
  } catch (err) {
    throw new Error(JSON.stringify(err).substr(0, 800))
  }
}
