import * as fs from 'fs'

// ----------------------------------------------
// read .registries.json configurations
// ----------------------------------------------
const defaultRegistryConf = {
  'default-registry': 'dockerhub',
  registries: [{
    name: 'dockerhub', type: 'dockerhub', defaultNamespace: 'docker', username: '', password: '',
  }],
}
let tempConf = defaultRegistryConf
if (typeof (process.env.DOCKER_REGISTRIES) !== 'undefined') {
  tempConf = JSON.parse(process.env.DOCKER_REGISTRIES)
} else {
  const configFile = process.env.DOCKER_REGISTRIES_FILE || './registries.json'
  if (fs.existsSync(configFile)) {
    tempConf = JSON.parse(fs.readFileSync(configFile).toString())
  } else {
    console.warn(`Warning. Config file does not exists. Using anonymous access to dockerhub instead. File: ${configFile}`)
    tempConf = defaultRegistryConf
  }
}

// validate registry conf
if (typeof (tempConf.registries) === 'undefined'
|| tempConf.registries.length === 0
) {
  console.warn('Warning. Registry conf is not right. Using anonymous access to dockerhub instead.')
  tempConf = defaultRegistryConf
}

// ----------------------------------------------
// exports
// ----------------------------------------------
export const env = process.env.NODE_ENV || 'production'
export const registryConf = tempConf
export const { registries } = registryConf
export const defaultRegistry = (typeof (registryConf['default-registry']) !== 'undefined') ? registryConf['default-registry'] : registryConf.registries[0].name

// ----------------------------------------------
// print configuration highlights
// ----------------------------------------------
export const echo = () => {
  console.info('Environment:', `'${env}'`)
  console.info('Registries count:', registries.length)
  console.info('--------------------------------------------------')
}
