"use strict"

// Load supported registry types
import * as dockerhub from "./dockerhub"
import * as gcr from "./gcr"

// registry data model
const registryTypes: Map<string, any> = new Map([])
registryTypes.set(dockerhub.type, dockerhub)
registryTypes.set(gcr.type, gcr)

const registries: Map<string, any> = new Map([])

// ----------------------------------------------
// init
// ----------------------------------------------
export const init = async (registriesConfig: any[]) => {

    for (const config of registriesConfig) {
        config.type = config.type.toLowerCase()
        if (!registryTypes.has(config.type)) {
            const err = "ERROR! Docker registries config file includes unsupported registry type." + config.name + ":" + config.type + "."
            console.log(err)
            throw ({ message: err })
        }
        const registry = registryTypes.get(config.type)
        const context = await registry.init(config)
        registries.set(config.name, context)
    }
}

// ----------------------------------------------
// getRegistries
// ----------------------------------------------
export const getRegistries = async (where: any): Promise<any[]> => {
    // make sure there is no where expression for the namespace query
    if (where !== null) {
        throw ({ message: "Query the \"Registries\" table does not support the WHERE clause." })
    }
    const records: any[] = []
    for (const name of registries.keys()) {
        records.push({ "name": name, "type": registries.get(name).type, "namespace": registries.get(name).namespace })
    }
    console.log (records)
    console.log("Get registries successfull. Count:", records.length)
    return records
}

// ----------------------------------------------
// Helper function: Break a simple where clause and extract column name and value
// ----------------------------------------------
const analyzeSimpleWhere = (where: any, throwMessage: any) => {
    if (where === null) {
        throw (throwMessage)
    }

    if (where.operator !== "=") {
        throw (throwMessage)
    }

    if ((typeof (where.left.column) === "undefined" && typeof (where.right.column) === "undefined")
        || (typeof (where.left.column) !== "undefined" && where.left.column.toLowerCase() !== "registry" && where.left.column.toLowerCase() !== "repo")
        || (typeof (where.right.column) !== "undefined" && where.right.column.toLowerCase() !== "registry" && where.right.column.toLowerCase() !== "repo")) {
        throw (throwMessage)
    }

    const column = (where.left.type === "column_ref") ? where.left.column : where.right.column
    const value = (where.left.type === "string") ? where.left.value : where.right.value

    return { "column": column, "value": value }
}

// ----------------------------------------------
// WhoAmI - information about the registry
// ----------------------------------------------
export const whoami = async (where: any): Promise<any[]> => {
    const throwMessage = { message: "Query the \"whoami\" table must include a WHERE clause in the form: WHERE registry = \"{{registry}}\"." }
    const simpleWhere = analyzeSimpleWhere(where, throwMessage)
    if (simpleWhere.column !== "registry") {
        throw throwMessage
    }

    const name = simpleWhere.value
    const context = registries.get(name)
    const type = context.type
    const registry = registryTypes.get(type)
    return registry.whoami(context)
}

// ----------------------------------------------
// getRepos
// ----------------------------------------------
export const getRepos = async (where: any): Promise<any[]> => {

    const throwMessage = { message: "Query the \"Repos\" table must include a WHERE clause in the form: WHERE registry = \"{{registry}}\"." }
    const simpleWhere = analyzeSimpleWhere(where, throwMessage)
    if (simpleWhere.column !== "registry") {
        throw throwMessage
    }

    const name = simpleWhere.value
    const context = registries.get(name)
    const type = context.type
    const registry = registryTypes.get(type)
    return registry.getRepos(context)
}

// ----------------------------------------------
// getTags
// ----------------------------------------------
export const getTags = async (where: any): Promise<any[]> => {

    const throwMessage = { message: "Query the \"Tags\" table must include a WHERE clause in the form: WHERE registry = \"{{registry]}}\" AND repo = \"{{repo}}\"." }

    // where clause analysis
    if (where === null) {
        throw (throwMessage)
    }

    if (where.operator !== "AND"
        || typeof (where.left.operator) === "undefined"
        || where.left.operator !== "="
        || typeof (where.right.operator) === "undefined"
        || where.right.operator !== "="
    ) {
        throw (throwMessage)
    }

    const left = analyzeSimpleWhere(where.left, throwMessage)
    const right = analyzeSimpleWhere(where.right, throwMessage)

    if (left.column === right.column) { // where must include both "registry" and "repo"
        throw (throwMessage)
    }

    const name = (left.column === "registry") ? left.value : right.value
    const repo = (left.column === "repo") ? left.value : right.value
    const context = registries.get(name)
    const type = context.type
    const registry = registryTypes.get(type)
    return registry.getTags(context, repo)
}
