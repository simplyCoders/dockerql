import consoleStamp = require("console-stamp")

import { connect, query } from './registries'

// ----------------------------------------------
// interfaces
// ----------------------------------------------
export interface iDockerQLResponse { // response is a generic returned result or error
    code: number
    msg: string,
    count?: number,
    data?: any
}

export interface iDockerQLRegistry { // registry is a definition of connection details with a registry
    name: string,
    type: string,
    namespace: string,
    username: string,
    password: string
}

// ----------------------------------------------
// main class
// ----------------------------------------------
export class DockerQL {
    private sessions: any = { default: '', entries: new Map([]) }

    constructor(
        options?: {
            verbose: boolean
        }
    ) {
        const verbose = typeof options.verbose !== "boolean" ? false : options.verbose
        const level = (verbose) ? 'log' : 'error'
        consoleStamp(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l', level: level })
    }

    // ----------------------------------------------
    // connect additional registry
    // ----------------------------------------------
    protected connect = async (registry: iDockerQLRegistry, isDefault?: boolean): Promise<iDockerQLResponse> => {
        try {
            await connect(registry, this.sessions, isDefault)
            return { code: 200, msg: "Ok." }

        } catch (err) {
            console.error(err)
            return {
                code: 400,
                msg: err.message
            }
        }
    }

    // ----------------------------------------------
    // the query method
    // ----------------------------------------------
    protected query = async (sql: string): Promise<iDockerQLResponse> => {
        try {
            return query(sql, this.sessions)
        } catch (err) {
            console.error(err)
            return {
                code: 400,
                msg: err.message
            }
        }
    }
}
