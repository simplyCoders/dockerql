import { getRegistryType, iActiveSessions } from './types'
import { analyzeWhere } from './where-helpers'

// ----------------------------------------------
// getNamespaces
// ----------------------------------------------
export const getNamespaces = async (
  where: any,
  sessions: iActiveSessions
): Promise<any[]> => {
  const throwMessage = new Error(`WHERE for 'Namespaces' may only filter by 'Registry' and 'Host'.`)
  const supportedColumns = ['registry', 'host']

  const columns = analyzeWhere(where, supportedColumns, throwMessage)

  const registryName = (typeof (columns.registry) !== 'undefined') ? columns.registry : sessions.default
  if (typeof sessions.entries[registryName] === 'undefined') {
    throw new Error(`WHERE clause includes unknown registry name '${registryName}'.`)
  }

  const session = sessions.entries[registryName]
  const host = (typeof (columns.host) !== 'undefined') ? columns.host : session.host

  return getRegistryType(session.type).getNamespaces(session, host)
}
