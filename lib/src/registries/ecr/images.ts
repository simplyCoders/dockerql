
import { iSession } from '../types'

// ----------------------------------------------
// perform get images
// ----------------------------------------------
export const getImages = async (
  session: iSession,
  host: string,
  namespace: string,
  repo: string,
): Promise<any[]> => {
  const records: any[] = []

  try {
    const resp = await session.custom.ecr.describeImages(
      {
        repositoryName: repo,
      },
    ).promise()

    resp.imageDetails.forEach((manifest: any) => {
      records.push({
        registry: session.registry,
        host,
        namespace,
        repo: manifest.repositoryName,
        digest: manifest.imageDigest,
        tags: manifest.imageTags,
        size: manifest.imageSizeInBytes,
        pushed: manifest.imagePushedAt,
      })
    })

    return records
  } catch (err) {
    throw new Error(JSON.stringify(err).substr(0, 800))
  }
}
