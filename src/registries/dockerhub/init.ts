import axios from 'axios'

export const type = 'dockerhub'

export const init = async (config:any): Promise<any> => {
  const host = 'https://hub.docker.com/v2/'

  const tempNamespace = (typeof (config.username) !== 'undefined' && config.username !== '') ? config.username : 'docker'
  const namespace = (typeof (config.namespace) !== 'undefined') ? config.namespace : tempNamespace

  if (typeof (config.username) === 'undefined' || config.username === '') {
    console.info('Annonymous dockerhub access, namespace:', namespace)
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
    const resp = await axios.post(`${host}users/login/`, data)
    const { token } = resp.data
    const context = {
      type, name: config.name, host, username: config.username, namespace, token,
    }

    console.info(`Authenticated successfully to ${config.name} (type: ${type})`)
    console.info('Namespace:', namespace)
    console.info('User:', config.username)

    return context
  } catch (err) {
    console.error(JSON.stringify(err).substr(0, 800))
    throw err
  }
}
