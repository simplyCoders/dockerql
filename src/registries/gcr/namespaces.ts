// perform get all namespaces
export const getNamespaces = async (context: any, host: string): Promise<any[]> => {
  const records = [
    {
      registry: context.name,
      host,
      namespace: context.namespace,
    },
  ]
  console.info('Get repos successfull. Count:', records.length)
  return records
}
