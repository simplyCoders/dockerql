import { iActiveSessions } from './types'

// define registry
interface RegistryRecord {
    registry: string
    type: string
    host: string
    namespace: string
  }

// ----------------------------------------------
// getRegistries
// ----------------------------------------------
export const getRegistries = async (where: any, sessions: iActiveSessions): Promise<any[]> => {
  if (where !== null) {
    throw new Error('Query the "Registries" table does not support the WHERE clause.')
  }
  const records: RegistryRecord[] = []
  sessions.entries.forEach((session) => {
    records.push({
      registry: session.registry,
      type: session.type,
      host: session.host,
      namespace: session.namespace,
    })
  })
  return records
}
