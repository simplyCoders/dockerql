import axios from 'axios'

// perform get all repos
export const getRepos = async (context:any, namespace: string): Promise<any[]> => {
  const endpoint = `https://${namespace}/v2/_catalog`
  try {
    const resp = await axios.get(endpoint,
      {
        headers: {
          authorization: `Bearer ${context.token}`,
        },
      })
    const records:any[] = []
    resp.data.repositories.forEach((name:string) => {
      records.push({
        registry: context.name,
        namespace,
        repo: name,
      })
    })

    console.info('Get repos successfull. Count:', records.length)
    return records
  } catch (err) {
    console.error(JSON.stringify(err).substr(0, 800))
    throw (err)
  }
}
