import axios from 'axios'

// perform get images
export const getImages = async (
  context: any,
  host:string,
  namespace: string,
  repo: string,
): Promise<any[]> => {
  const endpoint = `https://${host}/v2/repositories/${namespace}/${repo}/tags/`
  const records:any[] = []

  try {
    let nextEndpoint = endpoint
    while (nextEndpoint !== null) {
      /* eslint-disable no-await-in-loop */
      const resp = await axios.get(nextEndpoint,
        {
          headers: {
            authorization: `Bearer ${context.token}`,
          },
        })
      /* eslint-disable no-await-in-loop */

      resp.data.results.forEach((manifest:any) => {
        records.push({
          registry: context.name,
          host,
          namespace,
          repo,
          digest: manifest.images.length === 0 ? '' : manifest.images[0].digest,
          tag: manifest.name,
          size: manifest.full_size,
          created: manifest.tag_last_pushed,
          pushed: manifest.tag_last_pushed,
          pulled: manifest.tag_last_pulled,
        })
      })

      nextEndpoint = resp.data.next
      if (nextEndpoint !== null) {
        console.info('Fetch additional page.')
      }
    }
    console.info('Get images successfull. Count:', records.length)
    return records
  } catch (err) {
    console.error(JSON.stringify(err).substr(0, 800))
    throw (err)
  }
}
