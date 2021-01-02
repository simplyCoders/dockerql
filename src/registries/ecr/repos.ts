// perform get all repos
export const getRepos = async (context: any, host: string, namespace: string): Promise<any[]> => {
  const records: any[] = []
  try {
    const resp = await context.ecr.describeRepositories().promise()
    console.log(resp)

    resp.repositories.forEach((repo: any) => {
      records.push({
        registry: context.name,
        host,
        namespace,
        repo: repo.repositoryName,
        isPrivate: true,
        created: repo.createdAt,
      })
    })

    console.info('Get repos successfull. Count:', records.length)
    return records
  } catch (err) {
    console.error(JSON.stringify(err).substr(0, 800))
    throw (err)
  }
}
