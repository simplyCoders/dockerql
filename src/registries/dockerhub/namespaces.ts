import axios from 'axios'
import { verbose } from '../../config'

// perform get all namespaces
export const getNamespaces = async (context: any, host: string): Promise<any[]> => {
  if (context.token === '') { // if this is anonymous user then return empty list
    return []
  }

  const endpoint = `https://${host}/v2/repositories/namespaces/`
  try {
    const resp = await axios.get(endpoint,
      {
        headers: {
          authorization: `Bearer ${context.token}`,
        },
      })
    const records:any[] = []
    resp.data.namespaces.forEach((namespace: string) => {
      records.push({
        registry: context.name,
        host,
        namespace,
      })
    })

    verbose(`Get repos successfull. Count:${records.length}`)
    return records
  } catch (err) {
    console.error(JSON.stringify(err).substr(0, 800))
    throw (err)
  }
}
