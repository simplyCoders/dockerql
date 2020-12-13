"use strict"
import { Context } from "./context"

// perform get WhoAmI - information about current logged in user
export const whoAmI = async (where:any):Promise<any[]> => {
    console.log("Who am i successfull.")
    return [
        {"username":Context.username, "endpoint":Context.baseEndpoint, "isAuthenticated":(Context.token!=="")?true:false}
    ]
}
