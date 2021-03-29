import * as registries from './registries'
import * as logger from './helpers/logger'
import { Registry, Options, Response } from './types'

// ----------------------------------------------
// Data structure
// ----------------------------------------------
const sessions: any = { default: '', entries: new Map([]) }

// ----------------------------------------------
// Init
// ----------------------------------------------
export const init = (options?: Options) => {
    const logLevel = (typeof options === "undefined" || typeof options.loglevel !== "number")
        ? 0 : options.loglevel
    logger.setLoglevel(logLevel)
}

// ----------------------------------------------
// Connect a registry. 
// User may call this function multiple times to connect to mutiple registries
// ----------------------------------------------
export const connect = async (registry: Registry, isDefault?: boolean) => {
    await registries.connect(registry, sessions, isDefault)
}

// ----------------------------------------------
// Query
// ----------------------------------------------
export const query = async (sql: string): Promise<Response> => {
    return await registries.query(sql, sessions)
}
