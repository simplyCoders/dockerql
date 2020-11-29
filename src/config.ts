// Auto-detect configuration
export const env = process.env.NODE_ENV || "production"

export const echo = () => {
    console.log("Environment:", "'"+env+"'")
}