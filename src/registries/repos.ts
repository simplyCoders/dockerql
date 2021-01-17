import { getRegistryType } from './registry-types'
import { analyzeWhere } from './where-helpers'

// ----------------------------------------------
// getRepos
// ----------------------------------------------
export const getRepos = async (
  where: any,
  registries: Map<string, any>,
  defaultRegistry: string,
): Promise<any[]> => {
  const throwMessage = new Error('WHERE for "Repos" may only filter by "Registry", "Host" and "Namespace".')
  const supportedColumns = ['registry', 'namespace', 'host']

  const columns = analyzeWhere(where, supportedColumns, throwMessage)

  const registryName = (typeof (columns.registry) !== 'undefined') ? columns.registry : defaultRegistry
  if (typeof (registries.get(registryName)) === 'undefined') {
    throw new Error(`WHERE clause includes unknown registry name "${registryName}".`)
  }

  const context = registries.get(registryName)
  const namespace = (typeof (columns.namespace) !== 'undefined') ? columns.namespace : context.namespace
  const host = (typeof (columns.host) !== 'undefined') ? columns.host : context.host

  return getRegistryType(context.type).getRepos(context, host, namespace)
}
