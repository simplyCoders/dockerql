import { DQLError } from '../types'
import { getRegistryType, iActiveSessions } from './types'
import { analyzeWhere } from './where-helpers'

// ----------------------------------------------
// getImages
// ----------------------------------------------
export const getImages = async (
  where: any,
  sessions: iActiveSessions,
): Promise<any[]> => {
  const throwMessage = {
    code: 400,
    message: `WHERE for "Images" must filter by "Repo", and may filter by "Registry", "Host" and "Namespace".`
  } as DQLError
  const supportedColumns = ['registry', 'host', 'namespace', 'repo']

  const columns = analyzeWhere(where, supportedColumns, throwMessage)
  if (typeof (columns.repo) === 'undefined') { // WHERE clause must contain repo = {{repo}}
    throw throwMessage
  }

  const registryName = (typeof (columns.registry) !== 'undefined') ? columns.registry : sessions.default
  if (typeof sessions.entries[registryName] === 'undefined') {
    throw {
      code: 400,
      message: `WHERE clause includes unknown registry name "${registryName}".`
    } as DQLError
  }

  const session = sessions.entries[registryName]
  const host = (typeof (columns.host) !== 'undefined') ? columns.host : session.host
  const namespace = (typeof (columns.namespace) !== 'undefined') ? columns.namespace : session.namespace
  const { repo } = columns

  return getRegistryType(session.type).getImages(session, host, namespace, repo)
}
