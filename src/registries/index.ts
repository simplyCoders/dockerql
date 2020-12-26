import { getRegistryType, isARegistryType } from './registry-types'
import { getRegistries } from './registries'
import { getNamespaces } from './namespaces'
import { getRepos } from './repos'
import { getImages } from './images'

const registries: Map<string, any> = new Map([])
let defaultRegistry = 'dockerhub'

// ----------------------------------------------
// init
// ----------------------------------------------
export const init = async (config: any) => {
  defaultRegistry = config.defaultRegistry

  await Promise.all(config.registries.map(async (element: any) => {
    const type = element.type.toLowerCase()
    if (!isARegistryType(type)) {
      const err = `ERROR! Docker registries config file includes unsupported registry type."${element.name}:${element.type}".`
      console.error(err)
      throw (new Error(err))
    }
    const context = await getRegistryType(type).init(element)
    registries.set(element.name, context)
  }))
}

// ----------------------------------------------
// rounter
// ----------------------------------------------
export const getTable = async (tableName: string, where: any): Promise<any[]> => {
  switch (tableName) {
    case 'registries':
      return getRegistries(where, registries)
    case 'namespaces':
      return getNamespaces(where, registries, defaultRegistry)
    case 'repos':
      return getRepos(where, registries, defaultRegistry)
    case 'images':
      return getImages(where, registries, defaultRegistry)
    default:
      throw (new Error(`Unknown table name "${tableName}".`))
  }
}
