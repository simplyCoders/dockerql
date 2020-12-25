"use strict"

// Load supported registry types
import * as dockerhub from "./dockerhub"
import * as gcr from "./gcr"

// registry data model
const registryTypes: Map<string, any> = new Map([])
registryTypes.set(dockerhub.type, dockerhub)
registryTypes.set(gcr.type, gcr)

const registries: Map<string, any> = new Map([])
let defaultRegistry = "dockerhub"

// ----------------------------------------------
// init
// ----------------------------------------------
export const init = async (config: any) => {

    defaultRegistry = config.defaultRegistry
    for (const registryConfig of config.registries) {
        config.type = registryConfig.type.toLowerCase()
        if (!registryTypes.has(registryConfig.type)) {
            const err = "ERROR! Docker registries config file includes unsupported registry type." + registryConfig.name + ":" + registryConfig.type + "."
            console.log(err)
            throw ({ message: err })
        }
        const registry = registryTypes.get(registryConfig.type)
        const context = await registry.init(registryConfig)
        registries.set(registryConfig.name, context)
    }
}

// ----------------------------------------------
// Helper function: Break a simple where clause and extract column name and value
// Make validation for everything and make sure the column is in the list of supportedColumns
// ----------------------------------------------
const analyzeSimpleWhere = (where: any, supportedColumns: string[], throwMessage: any) => {

    // where clause must not be empty
    if (where === null) {
        throw (throwMessage)
    }
    // operator must be "="
    if (where.operator !== "=") {
        throw (throwMessage)
    }

    // comarison must be between a column and a string
    if (!(where.left.type === "column_ref" && where.right.type === "string"
        || where.left.type === "string" && where.right.type === "column_ref")) {
        throw (throwMessage)
    }

    // get column name and comparion value
    const column = (where.left.type === "column_ref") ? where.left.column.toLowerCase() : where.right.column.toLowerCase()
    const value = (where.left.type === "string") ? where.left.value : where.right.value

    // column must be one of the supportedColumns
    if (!supportedColumns.includes(column)) {
        throw (throwMessage)
    }

    const result:any = {}
    result[column] = value
    return result
}

// ----------------------------------------------
// Helper function: Scan an entire where clause for column names and comparison values
// ----------------------------------------------
const analyzeWhere = (where: any, supportedColumns: string[], throwMessage: any): any => {
    if (where===null) {
        return {}
    }

    if (where.operator === "AND") {
        return Object.assign (analyzeWhere (where.left, supportedColumns, throwMessage), analyzeWhere (where.right, supportedColumns, throwMessage))
    }

    return analyzeSimpleWhere(where, supportedColumns, throwMessage)
}

// ----------------------------------------------
// rounter
// ----------------------------------------------
export const getTable = async (tableName: string, where: any): Promise<any[]> => {

    switch (tableName) {
        case "registries":
            return getRegistries(where)
        case "namespaces":
            return getNamespace(where)
        case "repos":
            return getRepos(where)
        case "images":
            return getImages(where)
        default:
            throw ({ message: "Unknown table name '" + tableName + "'." })
    }
}

// ----------------------------------------------
// getRegistries
// ----------------------------------------------
const getRegistries = async (where: any): Promise<any[]> => {
    if (where !== null) {
        throw ({ message: "Query the 'Registries' table does not support the WHERE clause." })
    }
    const records: any[] = []
    for (const name of registries.keys()) {
        records.push({ "registry": name, "type": registries.get(name).type, "namespace": registries.get(name).namespace })
    }
    console.log("Get registries successfull. Count:", records.length)
    return records
}

// ----------------------------------------------
// getNamespace
// ----------------------------------------------
const getNamespace = async (where: any): Promise<any[]> => {

    const throwMessage = { message: "WHERE clause for 'Namespaces' table may only include optional 'Registry' filter." }
    const supportedColumns = ["registry"]

    const columns = analyzeWhere(where, supportedColumns, throwMessage)

    const registryName = (typeof(columns.registry)!=="undefined") ? columns.registry : defaultRegistry
    const context = registries.get(registryName)
    const registry = registryTypes.get(context.type)

    return registry.getNamespaces(context)
}

// ----------------------------------------------
// getRepos
// ----------------------------------------------
const getRepos = async (where: any): Promise<any[]> => {

    const throwMessage = { message: "WHERE clause for 'Repos' table may only include optional 'Registry' and 'Namespace' filter." }
    const supportedColumns = ["registry", "namespace"]

    const columns = analyzeWhere(where, supportedColumns, throwMessage)

    const registryName = (typeof(columns.registry)!=="undefined") ? columns.registry : defaultRegistry
    const context = registries.get(registryName)
    const namespace = (typeof(columns.namespace)!=="undefined") ? columns.namespace : context.namespace
    const registry = registryTypes.get(context.type)

    return registry.getRepos(context, namespace)

}

// ----------------------------------------------
// getImages
// ----------------------------------------------
const getImages = async (where: any): Promise<any[]> => {

    const throwMessage = { message: "WHERE clause for 'Images' table must include 'Repo' filter and may include optional 'Registry' and 'Namespace' filter." }
    const supportedColumns = ["registry", "namespace", "repo"]

    const columns = analyzeWhere(where, supportedColumns, throwMessage)
    if (typeof(columns.repo)==="undefined") { // WHERE clause must contain repo = {{repo}}
        throw throwMessage
    }

    const registryName = (typeof(columns.registry)!=="undefined") ? columns.registry : defaultRegistry
    const context = registries.get(registryName)
    const namespace = (typeof(columns.namespace)!=="undefined") ? columns.namespace : context.namespace
    const repo = columns.repo
    const registry = registryTypes.get(context.type)

    return registry.getImages(context, namespace, repo)
}
