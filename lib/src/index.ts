import * as registries from './registries'
import * as logger from './helpers/logger'

// ----------------------------------------------
// interfaces
// ----------------------------------------------
export interface Registry { // registry is a definition of connection details with a registry
    name: string,
    type: string,
    namespace?: string,
    username?: string,
    password?: string
}

export interface Options { // response is a generic returned result or error
    loglevel?: number // 0 - none, 1 - info and above, 2 - warn and above, 3 - error and above
}

// ----------------------------------------------
// Data structure
// ----------------------------------------------
const sessions: any = { default: '', entries: new Map([]) }

// ----------------------------------------------
// Setup
// ----------------------------------------------
export const setup = (options?: Options) => {
    const logLevel = (typeof options === "undefined" || typeof options.loglevel !== "number")
        ? 0 : options.loglevel
    logger.setLoglevel(logLevel)
}

// ----------------------------------------------
// Connect to a registry. 
// User may call this function multiple times to connect to mutiple registries
// ----------------------------------------------
export const connect = async (registry: Registry, isDefault?: boolean) => {
    await registries.connect(registry, sessions, isDefault)
}

// ----------------------------------------------
// the query method
// ----------------------------------------------
export const query = async (sql: string): Promise<any[]> => {
    return await registries.query(sql, sessions)
}
