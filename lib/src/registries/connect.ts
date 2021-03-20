import { getRegistryType, isARegistryType, iRegistry, iActiveSessions } from './types'

// ----------------------------------------------
// connect (to registry)
// ----------------------------------------------

export const connect = async (registry: iRegistry, sessions: iActiveSessions, isDefault?:boolean) => {

    if (registry.name === '') {
        throw new Error(`ERROR! A registry must include a name.`)
    }

    if (typeof (sessions[registry.name]) !== 'undefined') {
        throw new Error(`ERROR! A registry with same name already exists.`)
    }

    if (!isARegistryType(registry.type)) {
        throw new Error(`ERROR! Docker registries config file includes unsupported registry type."${registry.name}:${registry.type}` )
    }

    const session = getRegistryType(registry.type).connect(registry)
    sessions.entries[registry.name] = session

    if (typeof isDefault === 'boolean' && isDefault) {
        sessions.default = registry.name
    }

}
