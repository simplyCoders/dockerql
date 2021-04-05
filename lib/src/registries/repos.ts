import { DQLError } from '../types'
import { getRegistryType, iActiveSessions } from './types'
import { analyzeWhere } from './where-helpers'

// ----------------------------------------------
// getRepos
// ----------------------------------------------
export const getRepos = async (
  where: any,
  sessions: iActiveSessions
): Promise<any[]> => {
  const throwMessage = { 
    code: 400, 
    message: `WHERE for "Repos" may only filter by "Registry", "Host" and "Namespace".` 
  } as DQLError
  const supportedColumns = ['registry', 'namespace', 'host']

  const columns = analyzeWhere(where, supportedColumns, throwMessage)

  const registryName = (typeof columns.registry === 'string') ? columns.registry : sessions.default
  if (typeof sessions.entries[registryName] === 'undefined') {
    throw { 
      code: 400, 
      message: `WHERE clause includes unknown registry name "${registryName}".` 
    } as DQLError
  }

  const session = sessions.entries[registryName]
  const namespace = (typeof (columns.namespace) !== 'undefined') ? columns.namespace : session.namespace
  const host = (typeof (columns.host) !== 'undefined') ? columns.host : session.host

  return getRegistryType(session.type).getRepos(session, host, namespace)
}
