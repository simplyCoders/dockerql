import { DockerQL } from "dockerql"

const dockerql = new DockerQL()
dockerql.connect ()
const response = await dockerql.query(`SELECT * FROM repos WHERE namespace = "simplycoders"`)
console.log(response)
