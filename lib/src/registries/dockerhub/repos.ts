import axios from 'axios'

import { iSession } from '../types'
import * as logger from '../../helpers/logger'

// ----------------------------------------------
// perform get all repos
// ----------------------------------------------
export const getRepos = async (session: iSession, host: string, namespace: string): Promise<any[]> => {
  const endpoint = `https://${host}/v2/repositories/${namespace}/`
  const records: any[] = []

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

    resp.data.results.forEach((repo: any) => {
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
      logger.info('Fetch additional page.')
    }
  }
  return records
}
