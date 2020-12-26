import { getRegistryType } from './registry-types'
import { analyzeWhere } from './where-helpers'

// ----------------------------------------------
// getImages
// ----------------------------------------------
export const getImages = async (
  where: any,
  registries: Map<string, any>,
  defaultRegistry: string,
): Promise<any[]> => {
  const throwMessage = new Error('WHERE for "Images" must filter by "Repo", and may filter by "Registry", "Host" and "Namespace".')
  const supportedColumns = ['registry', 'host', 'namespace', 'repo']

  const columns = analyzeWhere(where, supportedColumns, throwMessage)
  if (typeof (columns.repo) === 'undefined') { // WHERE clause must contain repo = {{repo}}
    throw throwMessage
  }

  const registryName = (typeof (columns.registry) !== 'undefined') ? columns.registry : defaultRegistry
  const context = registries.get(registryName)
  const host = (typeof (columns.host) !== 'undefined') ? columns.host : context.host
  const namespace = (typeof (columns.namespace) !== 'undefined') ? columns.namespace : context.namespace
  const { repo } = columns

  return getRegistryType(context.type).getImages(context, host, namespace, repo)
}
