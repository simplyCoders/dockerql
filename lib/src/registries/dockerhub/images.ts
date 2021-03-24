import axios from 'axios'

import { iSession } from '../types'
import * as logger from '../../helpers/logger'

// ----------------------------------------------
// perform get images
// ----------------------------------------------
export const getImages = async (
  session: iSession,
  host: string,
  namespace: string,
  repo: string,
): Promise<any[]> => {
  const endpoint = `https://${host}/v2/repositories/${namespace}/${repo}/tags/`
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

    resp.data.results.forEach((manifest: any) => {
      records.push({
        registry: session.registry,
        host,
        namespace,
        repo,
        digest: manifest.images.length === 0 ? '' : manifest.images[0].digest,
        architecture: manifest.images.length === 0 ? '' : manifest.images[0].architecture,
        os: manifest.images.length === 0 ? '' : manifest.images[0].os,
        tags: [manifest.name],
        size: manifest.full_size,
        pushed: manifest.tag_last_pushed,
        pulled: manifest.tag_last_pulled,
      })
    })

    nextEndpoint = resp.data.next
    if (nextEndpoint !== null) {
      logger.info('Fetch additional page.')
    }
  }
  return records
}
