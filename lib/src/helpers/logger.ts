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
    if (value < 0) options.loglevel = 0
    else if (value > 3) options.loglevel = 3
    else options.loglevel = Math.trunc(value)
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