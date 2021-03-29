
import { iSession } from '../types'

// ----------------------------------------------
// perform get all repos
// ----------------------------------------------
export const getRepos = async (session: iSession, host: string, namespace: string): Promise<any[]> => {
  const records: any[] = []
  const resp = await session.custom.ecr.describeRepositories().promise()

  resp.repositories.forEach((repo: any) => {
    records.push({
      registry: session.registry,
      host,
      namespace,
      repo: repo.repositoryName,
      arn: repo.repositoryArn,
      created: repo.createdAt,
      imageImmutability: repo.imageTagMutability,
      scanOnPush: typeof (repo.imageScanningConfiguration) === 'undefined' ? false : repo.imageScanningConfiguration.scanOnPush,
    })
  })

  return records
}
