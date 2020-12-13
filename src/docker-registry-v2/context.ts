export const Context = {
    baseEndpoint:  "",
    setBaseEndpoint: (text: string) => {
        Context.baseEndpoint = text
    },
    username: "",
    setUsername: (text: string) => {
        Context.username = text
    },
    token: "",
    setToken: (text: string) => {
        Context.token = text
    }
}
