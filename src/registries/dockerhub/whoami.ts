"use strict"

// perform get whoami - information about current logged in user
export const whoami = async (context:any):Promise<any[]> => {
    console.log("Whoami successfull.")
    return [
        {
            "name": context.name,
            "type": context.type,
            "host": context.host,
            "username":context.username,
            "isAuthenticated":(context.token!=="")?true:false
        }
    ]
}
