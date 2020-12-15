export const context = {
    type: "dockerhub",
    host:  "https://hub.docker.com/v2/",
    setHost: (text: string) => {
        context.host = text
    },
    username: "",
    setUsername: (text: string) => {
        context.username = text
    },
    token: "",
    setToken: (text: string) => {
        context.token = text
    }
}
