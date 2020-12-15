export * from "./namespaces"
export * from "./repos"
export * from "./tags"
export * from "./whoami"

import { context }  from "./context"
import * as auth from "./auth"

export const type = context.type
export const init = async (username: string, password: string) => {
    auth.login(username,password)
}

