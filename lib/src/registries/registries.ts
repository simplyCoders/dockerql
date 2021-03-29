import { iActiveSessions } from './types'
import { DQLError } from '../types'

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
    throw { code: 400, message: `Query the Registries table does not support the WHERE clause.` } as DQLError
  }
  const records: RegistryRecord[] = []
  for (const key in sessions.entries) {
    const session = sessions.entries[key]
    records.push({
      registry: session.registry,
      type: session.type,
      host: session.host,
      namespace: session.namespace,
    })
  }

  return records
}
