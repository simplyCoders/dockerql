import { analyzeWhere } from './where-helpers'
import * as dockerhub from './dockerhub'
import * as gcr from './gcr'

// registry data model
const registryTypes: Map<string, any> = new Map([])
registryTypes.set(dockerhub.type, dockerhub)
registryTypes.set(gcr.type, gcr)

// ----------------------------------------------
// getImages
// ----------------------------------------------
export const getImages = async (
  where: any,
  registries: Map<string, any>,
  defaultRegistry: string,
): Promise<any[]> => {
  const throwMessage = new Error('WHERE for "Images" must filter by "Repo", and may filter by "Registry", "Host" and "Namespace".')
  const supportedColumns = ['registry', 'namespace', 'host', 'repo']

  const columns = analyzeWhere(where, supportedColumns, throwMessage)
  if (typeof (columns.repo) === 'undefined') { // WHERE clause must contain repo = {{repo}}
    throw throwMessage
  }

  const registryName = (typeof (columns.registry) !== 'undefined') ? columns.registry : defaultRegistry
  const context = registries.get(registryName)
  const host = (typeof (columns.host) !== 'undefined') ? columns.host : context.host
  const namespace = (typeof (columns.namespace) !== 'undefined') ? columns.namespace : context.namespace
  const { repo } = columns
  const registry = registryTypes.get(context.type)

  return registry.getImages(context, host, namespace, repo)
}
