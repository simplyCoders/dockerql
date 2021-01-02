// perform get images
export const getImages = async (
  context: any,
  host: string,
  namespace: string,
  repo: string,
): Promise<any[]> => {
  const records: any[] = []

  try {
    const resp = await context.ecr.describeImages(
      {
        repositoryName: repo,
      },
    ).promise()

    resp.imageDetails.forEach((manifest: any) => {
      records.push({
        registry: context.name,
        host,
        namespace,
        repo: manifest.repositoryName,
        digest: manifest.imageDigest,
        tag: manifest.imageTags.length === 0 ? '' : manifest.imageTags[0],
        size: manifest.imageSizeInBytes,
        pushed: manifest.imagePushedAt,
      })
    })

    console.info('Get images successfull. Count:', records.length)
    return records
  } catch (err) {
    console.error(JSON.stringify(err).substr(0, 800))
    throw (err)
  }
}
