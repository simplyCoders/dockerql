import * as registries from './registries'
import * as logger from './helpers/logger'
import { Registry, Options, Response, DQLError } from './types'

// ----------------------------------------------
// Data structure
// ----------------------------------------------
const sessions: any = { default: '', entries: new Map([]) }

// ----------------------------------------------
// Init
// ----------------------------------------------
export const init = (options?: Options) => {

    // validate options
    if (typeof options != "undefined" && typeof options !== "object") {
        throw { code: 400, message: `Invalid Options parameter was provided.` } as DQLError
    }
    const supportedOptions = ['loglevel']
    for (const key in options) {
        if (!supportedOptions.includes(key)) {
            throw { code: 400, message: `Invalid Options parameter was provided.` } as DQLError
        }
    }
    if (typeof options!="undefined" && typeof options.loglevel!=="number") {
        throw { code: 400, message: `Invalid Options parameter was provided.` } as DQLError
    }

    // set loglevel
    const loglevel = (typeof options === "undefined" || typeof options.loglevel !== "number")
        ? 0 : options.loglevel
    logger.setLoglevel(loglevel)

    // clear sessions
    sessions.default = ''
    sessions.entries = new Map([])

}

// ----------------------------------------------
// Connect a registry. 
// User may call this function multiple times to connect to mutiple registries
// ----------------------------------------------
export const connect = async (registry: Registry, isDefault?: boolean): Promise<Response> => {
    return await registries.connect(registry, sessions, isDefault)
}

// ----------------------------------------------
// Query
// ----------------------------------------------
export const query = async (sql: string): Promise<Response> => {
    return await registries.query(sql, sessions)
}
