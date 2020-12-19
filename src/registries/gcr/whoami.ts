"use strict"

// perform get whoami - information about current logged in user
export const whoami = async (context:any):Promise<any[]> => {
    console.log("Whoami successfull.")
    return [
        {
            "name": context.name,
            "type": context.type,
            "host": context.host,
            "projectId": context.projectId,
            "keyId": context.keyId,
            "isAuthenticated":(context.token!=="")?true:false
        }
    ]
}
