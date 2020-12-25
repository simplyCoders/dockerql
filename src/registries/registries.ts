// define registry record
interface RegistryRecord {
    registry: string
    type: string
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
      namespace: element.namespace,
    })
  })
  console.info('Get registries successfull. Count:', records.length)
  return records
}
