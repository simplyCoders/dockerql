import { getRegistryType, isARegistryType, iRegistry, iActiveSessions } from './types'
import * as logger from '../helpers/logger'

// ----------------------------------------------
// connect (to registry)
// ----------------------------------------------

export const connect = async (registry: iRegistry, sessions: iActiveSessions, isDefault?: boolean) => {

    try {
        if (registry.name === '') {
            throw new Error(`ERROR! A registry must include a name.`)
        }

        if (typeof (sessions[registry.name]) !== 'undefined') {
            throw new Error(`ERROR! A registry with name "${registry.name}" already exists.`)
        }

        if (!isARegistryType(registry.type)) {
            throw new Error(`ERROR! "${registry.type}" is an unsupported registry type.`)
        }

        const session = await getRegistryType(registry.type).connect(registry)
        sessions.entries[registry.name] = session

        if (typeof isDefault === 'boolean' && isDefault || sessions.default === "") {
            sessions.default = registry.name
        }

    } catch (err) {
        const msg = (err instanceof Error) ? (err as Error).message : err
        logger.error(msg)
        throw new Error (msg)
    }
}
