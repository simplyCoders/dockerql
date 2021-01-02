import axios from 'axios'

export const type = 'dockerhub'

export const init = async (config:any): Promise<any> => {
  const host = 'hub.docker.com'

  const tempNamespace = (typeof (config.username) !== 'undefined' && config.username !== '') ? config.username : 'docker'
  const namespace = (typeof (config.namespace) !== 'undefined') ? config.namespace : tempNamespace

  if (typeof (config.username) === 'undefined' || config.username === '') {
    console.info('Anonymous dockerhub access, namespace:', namespace)
    const context = {
      type, name: config.name, host, namespace, token: '',
    }
    return context
  }

  const data = {
    username: config.username,
    password: config.password,
  }

  try {
    const resp = await axios.post(`https://${host}/v2/users/login/`, data)
    const { token } = resp.data
    const context = {
      type,
      name: config.name,
      host,
      username: config.username,
      namespace,
      token,
    }

    console.info(`Authenticated successfully to ${config.name} (type: ${type})`)
    console.info('Host:', host)
    console.info('Namespace (organization):', namespace)
    console.info('User:', config.username)
    console.info('--------------------------------------------------')

    return context
  } catch (err) {
    console.error(JSON.stringify(err).substr(0, 800))
    throw err
  }
}
