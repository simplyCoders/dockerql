import { Response, DQLError } from '../types'
import { getRegistryType, isARegistryType, iRegistry, iActiveSessions } from './types'
import * as logger from '../helpers/logger'

// ----------------------------------------------
// connect (to registry)
// ----------------------------------------------

export const connect = async (registry: iRegistry, sessions: iActiveSessions, isDefault?: boolean): Promise<Response> => {

    try {
        if (typeof registry !== 'object') {
            throw { code: 400, message: `Invalid Registry parameter was provided.` } as DQLError
        }

        if (typeof registry.name !== 'string' || registry.name === '') {
            throw { code: 400, message: `A registry must include a name.` } as DQLError
        }

        if (typeof (sessions.entries[registry.name]) !== 'undefined') {
            throw { code: 400, message: `A registry with name "${registry.name}" already exists.` } as DQLError
        }

        if (typeof registry.type !== 'string' || registry.type === '') {
            throw { code: 400, message: `A registry must include a type.` } as DQLError
        }

        if (!isARegistryType(registry.type)) {
            throw { code: 400, message: `"${registry.type}" is an unsupported registry type.` } as DQLError
        }

        const session = await getRegistryType(registry.type).connect(registry)
        sessions.entries[registry.name] = session

        if (typeof isDefault === 'boolean' && isDefault || sessions.default === "") {
            sessions.default = registry.name
        }

        // Publish the result set
        logger.info(`Ok, connected successfully.`)
        return { code: 200, message: 'Ok, connected successfully.' }

    } catch (err) {
        logger.error(err)
        const dqlErr = err as DQLError
        if (typeof dqlErr.code !== "undefined") {
            throw { code: dqlErr.code, message: dqlErr.message } as DQLError
        } else {
            throw { code: 400, message: `Bad request.` } as DQLError
        }
    }
}
