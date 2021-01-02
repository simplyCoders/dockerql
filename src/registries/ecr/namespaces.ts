// perform get all namespaces
export const getNamespaces = async (context: any, host: string): Promise<any[]> => [{
  registry: context.name,
  host,
  namespace: context.namespace,
}]
