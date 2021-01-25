import { verbose } from '../../config'

// perform get all repos
export const getRepos = async (context: any, host: string, namespace: string): Promise<any[]> => {
  const records: any[] = []
  try {
    const resp = await context.ecr.describeRepositories().promise()

    resp.repositories.forEach((repo: any) => {
      records.push({
        registry: context.name,
        host,
        namespace,
        repo: repo.repositoryName,
        arn: repo.repositoryArn,
        created: repo.createdAt,
        imageImmutability: repo.imageTagMutability,
        scanOnPush: typeof (repo.imageScanningConfiguration) === 'undefined' ? false : repo.imageScanningConfiguration.scanOnPush,
      })
    })

    verbose(`Get repos successfull. Count:${records.length}`)
    return records
  } catch (err) {
    console.error(JSON.stringify(err).substr(0, 800))
    throw (err)
  }
}
