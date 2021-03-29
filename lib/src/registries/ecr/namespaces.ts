
import { iSession } from '../types'

// ----------------------------------------------
// perform get all namespaces
// ----------------------------------------------

export const getNamespaces = async (session: iSession, host: string): Promise<any[]> => [{
  registry: session.registry,
  host,
  namespace: session.namespace,
}]
