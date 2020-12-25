import axios from 'axios'

export const type = 'gcr'

export const init = async (config: any): Promise<any> => {
  const host = (typeof (config.host) !== 'undefined') ? config.host : 'gcr.io'
  const namespace = (typeof (config.namespace) !== 'undefined') ? config.namespace : config.password.project_id

  const data = {
    username: config.username,
    password: JSON.stringify(config.password),
  }

  try {
    const endpoint = `https://${host}/v2/token?scope=repository:${namespace}/catalog:*&service=${host}`
    const resp = await axios.get(endpoint, { auth: data })
    const { token } = resp.data

    const context = {
      type,
      name: config.name,
      host,
      namespace,
      username: config.username,
      password: config.password,
      token,
    }

    console.info(`Authenticated successfully to ${config.name} (type: ${type})`)
    console.info('Host:', host)
    console.info('Namespace:', namespace)
    console.info('User:', config.username)

    return context
  } catch (err) {
    console.error(JSON.stringify(err).substr(0, 800))
    throw (err)
  }
}
