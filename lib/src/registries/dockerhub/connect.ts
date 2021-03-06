import axios from 'axios'

import { DQLError } from '../../types'
import { iRegistry, iSession } from '../types'
import * as logger from '../../helpers/logger'

// ----------------------------------------------
// connect
// ----------------------------------------------
export const connect = async (registry: iRegistry): Promise<iSession> => {
  const host = 'hub.docker.com'

  // dockerhub's namespace: 
  // If namespace was provided then use it, 
  // else if username was provided then use it as namespace
  // else if both are empty then use 'library' as the generic value
  let namespace = 'library'
  if (typeof registry.namespace !== 'undefined' && registry.namespace !== '') {
    namespace = registry.namespace
  }
  else if (typeof registry.username !== 'undefined' && registry.username !== '') {
    namespace = registry.username
  }

  // dockerhub's anonymous access: token is empty
  if (typeof (registry.username) === 'undefined' || registry.username === '') {
    logger.info(`Anonymous access to ${registry.name} (type: ${registry.type})`)
    logger.info(`Host: ${host}, Namespace (organization): ${namespace}`)
    logger.info('--------------------------------------------------')
    return {
      registry: registry.name,
      type: registry.type,
      namespace,
      host,
      token: ''
    }
  }

  const data = {
    username: registry.username,
    password: registry.password,
  }

  try {
    const resp = await axios.post(`https://${host}/v2/users/login/`, data)
    const { token } = resp.data

    logger.info(`Authenticated successfully to ${registry.name} (type: ${registry.type})`)
    logger.info(`Host: ${host}, Namespace (organization): ${namespace}, User: ${registry.username}`)
    logger.info('--------------------------------------------------')

    return {
      registry: registry.name,
      type: registry.type,
      namespace,
      host,
      token
    }
  } catch (err) {
    if (typeof err.response !== "undefined" && typeof err.response.status === "number") {
      logger.error(`Network error connecting to registry ${registry.name}`)

      if (err.response.status === 401) {
        throw { code: 401, message: `Incorrect authentication credentials.` } as DQLError
      }
    }
    throw { code: 400, message: `Bad request.` } as DQLError
  }
}
