import { DQLError } from '../types'
import { getRegistryType, iActiveSessions } from './types'
import { analyzeWhere } from './where-helpers'

// ----------------------------------------------
// getNamespaces
// ----------------------------------------------
export const getNamespaces = async (
  where: any,
  sessions: iActiveSessions
): Promise<any[]> => {
  const throwMessage = {
    code: 400,
    message: `WHERE for "Namespaces" may only filter by "Registry" and "Host".`
  } as DQLError
  const supportedColumns = ['registry', 'host']
  const columns = analyzeWhere(where, supportedColumns, throwMessage)

  const registryName = (typeof (columns.registry) !== 'undefined') ? columns.registry : sessions.default
  if (typeof sessions.entries[registryName] === 'undefined') {
    throw {
      code: 400,
      message: `WHERE clause includes unknown registry name "${registryName}".`
    } as DQLError
  }

  const session = sessions.entries[registryName]
  const host = (typeof (columns.host) !== 'undefined') ? columns.host : session.host

  return getRegistryType(session.type).getNamespaces(session, host)
}
