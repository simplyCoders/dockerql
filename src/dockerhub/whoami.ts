"use strict"
import { context } from "./context"

// perform get WhoAmI - information about current logged in user
export const whoAmI = async (where:any):Promise<any[]> => {
    console.log("Who am i successfull.")
    return [
        {
            "type": context.type,
            "host": context.host,
            "username":context.username,
            "isAuthenticated":(context.token!=="")?true:false
        }
    ]
}
