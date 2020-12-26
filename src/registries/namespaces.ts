import { getRegistryType } from './registry-types'
import { analyzeWhere } from './where-helpers'

// ----------------------------------------------
// getNamespaces
// ----------------------------------------------
export const getNamespaces = async (
  where: any,
  registries: Map<string, any>,
  defaultRegistry: string,
): Promise<any[]> => {
  const throwMessage = new Error('WHERE for "Namespaces" may only filter by "Registry" and "Host".')
  const supportedColumns = ['registry', 'host']

  const columns = analyzeWhere(where, supportedColumns, throwMessage)

  const registryName = (typeof (columns.registry) !== 'undefined') ? columns.registry : defaultRegistry
  const context = registries.get(registryName)
  const host = (typeof (columns.host) !== 'undefined') ? columns.host : context.host

  return getRegistryType(context.type).getNamespaces(context, host)
}
