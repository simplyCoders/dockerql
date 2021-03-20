import axios from 'axios'

import { iSession } from '../types'

// ----------------------------------------------
// perform get all repos
// ----------------------------------------------
export const getRepos = async (session: iSession, host: string, namespace: string): Promise<any[]> => {
  const endpoint = `https://${host}/v2/repositories/${namespace}/`
  const records:any[] = []
  try {
    let nextEndpoint = endpoint
    while (nextEndpoint !== null) {
      /* eslint-disable no-await-in-loop */
      const resp = await axios.get(nextEndpoint,
        {
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        })
      /* eslint-disable no-await-in-loop */

      resp.data.results.forEach((repo:any) => {
        records.push({
          registry: session.registry,
          host,
          namespace,
          repo: repo.name,
          description: repo.description,
          isPrivate: repo.is_private,
          updated: repo.last_updated,
          stars: repo.star_count,
          pulls: repo.pull_count,
        })
      })

      nextEndpoint = resp.data.next
      if (nextEndpoint !== null) {
        sessionStorage.debug('Fetch additional page.')
      }
    }
    return records
  } catch (err) {
    throw new Error(JSON.stringify(err).substr(0, 800))
  }
}
