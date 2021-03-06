import axios from 'axios'

import { iRegistry, iSession } from '../types'
import * as logger from '../../helpers/logger'

// ----------------------------------------------
// connect
// ----------------------------------------------
export const connect = async (registry: iRegistry): Promise<iSession> => {
  const host = (typeof (registry.host) !== 'undefined') ? registry.host : 'gcr.io'
  const namespace = (typeof (registry.namespace) !== 'undefined') ? registry.namespace : registry.password.project_id

  const data = {
    username: registry.username,
    password: JSON.stringify(registry.password),
  }

  const endpoint = `https://${host}/v2/token?scope=repository:${namespace}/catalog:*&service=${host}`
  const resp = await axios.get(endpoint, { auth: data })
  const { token } = resp.data

  logger.info(`Authenticated successfully to ${registry.name} (type: ${registry.type})`)
  logger.info(`Host: ${host}, Namespace (organization): ${namespace}, User: ${registry.username}`)
  logger.info('--------------------------------------------------')

  return {
    registry: registry.name,
    type: registry.type,
    namespace,
    host,
    token,
    custom: {
      username: registry.username,
      password: registry.password,
    }
  }
}
