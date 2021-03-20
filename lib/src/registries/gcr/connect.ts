import axios from 'axios'

import { iRegistry, iSession } from '../types'

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

  try {
    const endpoint = `https://${host}/v2/token?scope=repository:${namespace}/catalog:*&service=${host}`
    const resp = await axios.get(endpoint, { auth: data })
    const { token } = resp.data

    console.info(`Authenticated successfully to ${registry.name} (type: ${registry.type})`)
    console.info(`Host: ${host}, Namespace (organization): ${namespace}, User: ${registry.username}`)
    console.info('--------------------------------------------------')

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
  } catch (err) {
    throw new Error(JSON.stringify(err).substr(0, 800))
  }
}
