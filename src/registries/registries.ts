import { verbose } from '../config'

// define registry record
interface RegistryRecord {
    registry: string
    type: string
    host: string
    namespace: string
  }

// ----------------------------------------------
// getRegistries
// ----------------------------------------------
export const getRegistries = async (where: any, registries: Map<string, any>): Promise<any[]> => {
  if (where !== null) {
    throw (new Error('Query the "Registries" table does not support the WHERE clause.'))
  }
  const records: RegistryRecord[] = []
  registries.forEach((element) => {
    records.push({
      registry: element.name,
      type: element.type,
      host: element.host,
      namespace: element.namespace,
    })
  })
  verbose(`Get registries successfull. Count:${records.length}`)
  return records
}
