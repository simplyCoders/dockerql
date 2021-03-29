// ----------------------------------------------
// Public types exported by the lib
// ----------------------------------------------
export type Registry = // registry is a definition of connection details with a registry
    {
        name: string,
        type: string,
        namespace?: string,
        username?: string,
        password?: string
    }

export type Options = // Options to set up DockerQl
    {
        loglevel?: number // 0 - none, 1 - info and above, 2 - warn and above, 3 - error and above
    }

export type Response = // response is a generic returned result or error
    {
        code: number, // 200 - ok, 400 - bad request (many tupes), ...
        message: string,
        data?: any[]
    }

// ----------------------------------------------
// lib's Error type
// ----------------------------------------------
export type DQLError = Error & {
    code: number,
    message: string
}
