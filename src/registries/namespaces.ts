import { analyzeWhere } from './where-helpers'
import * as dockerhub from './dockerhub'
import * as gcr from './gcr'

// registry data model
const registryTypes: Map<string, any> = new Map([])
registryTypes.set(dockerhub.type, dockerhub)
registryTypes.set(gcr.type, gcr)

// ----------------------------------------------
// getNamespaces
// ----------------------------------------------
export const getNamespaces = async (
  where: any,
  registries: Map<string, any>,
  defaultRegistry: string,
): Promise<any[]> => {
  const throwMessage = new Error('WHERE for "Namespaces" may only filter by "Registry".')
  const supportedColumns = ['registry']

  const columns = analyzeWhere(where, supportedColumns, throwMessage)

  const registryName = (typeof (columns.registry) !== 'undefined') ? columns.registry : defaultRegistry
  const context = registries.get(registryName)
  const registry = registryTypes.get(context.type)

  return registry.getNamespaces(context)
}
