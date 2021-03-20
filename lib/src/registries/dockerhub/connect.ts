import axios from 'axios'

import { iRegistry, iSession } from '../types'

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
    console.info(`Anonymous access to ${registry.name} (type: ${registry.type})`)
    console.info(`Host: ${host}, Namespace (organization): ${namespace}`)
    console.info('--------------------------------------------------')
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

    console.info(`Authenticated successfully to ${registry.name} (type: ${registry.type})`)
    console.info(`Host: ${host}, Namespace (organization): ${namespace}, User: ${registry.username}`)
    console.info('--------------------------------------------------')

    return {
      registry: registry.name,
      type: registry.type,
      namespace,
      host,
      token
    }
  } catch (err) {
    throw new Error (JSON.stringify(err).substr(0, 800) )
  }
}
