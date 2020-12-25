import axios from 'axios'

// perform get all repos
export const getRepos = async (context: any, host: string, namespace: string): Promise<any[]> => {
  const endpoint = `https://${host}/v2/repositories/${namespace}/`
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

      resp.data.results.forEach((repo:any) => {
        records.push({
          registry: context.name,
          host,
          namespace,
          repo: repo.name,
          description: repo.description,
          isPrivate: repo.is_private,
          updated: repo.last_updated,
        })
      })

      nextEndpoint = resp.data.next
      if (nextEndpoint !== null) {
        console.info('Fetch additional page.')
      }
    }
    console.info('Get repos successfull. Count:', records.length)
    return records
  } catch (err) {
    console.error(JSON.stringify(err).substr(0, 800))
    throw (err)
  }
}
