import { analyzeWhere } from './where-helpers'
import * as dockerhub from './dockerhub'
import * as gcr from './gcr'

// registry data model
const registryTypes: Map<string, any> = new Map([])
registryTypes.set(dockerhub.type, dockerhub)
registryTypes.set(gcr.type, gcr)

// ----------------------------------------------
// getRepos
// ----------------------------------------------
export const getRepos = async (
  where: any,
  registries: Map<string, any>,
  defaultRegistry: string,
): Promise<any[]> => {
  const throwMessage = new Error('WHERE for "Repos" may only filter by "Registry" and "Namespace".')
  const supportedColumns = ['registry', 'namespace']

  const columns = analyzeWhere(where, supportedColumns, throwMessage)

  const registryName = (typeof (columns.registry) !== 'undefined') ? columns.registry : defaultRegistry
  const context = registries.get(registryName)
  const namespace = (typeof (columns.namespace) !== 'undefined') ? columns.namespace : context.namespace
  const registry = registryTypes.get(context.type)

  return registry.getRepos(context, namespace)
}
