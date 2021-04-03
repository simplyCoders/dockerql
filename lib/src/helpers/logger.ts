import { DQLError } from '../types'

// ----------------------------------------------
// logger level
// ----------------------------------------------
const options = {
    loglevel: 0 // 0 - none, 1 - info and above, 2 - warn and above, 3 - error and above
}

// ----------------------------------------------
// exports
// ----------------------------------------------
export const setLoglevel = (value: number) => {
    if (![0,1,2,3].includes(value)) {
        throw { code: 400, message: `Invalid Options.loglevel value was provided.` } as DQLError
    }

    options.loglevel = Math.trunc(value)
}

export const info = (str: string) => {
    if (options.loglevel >= 1) {
        const tm = new Date()
        console.info(`${tm.toISOString()}: ${str}`)
    }
}

export const error = (str: string) => {
    if (options.loglevel >= 3) {
        const tm = new Date()
        console.error(`${tm.toISOString()}: ${str}`)
    }
}