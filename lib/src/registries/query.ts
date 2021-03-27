/// <reference path="../index.d.ts" />
import * as sqlparser from 'node-sqlparser'
import alasql from 'alasql'

import { iActiveSessions } from './types'

import { getRegistries } from './registries'
import { getNamespaces } from './namespaces'
import { getRepos } from './repos'
import { getImages } from './images'
import * as logger from '../helpers/logger'

// ----------------------------------------------
// Helper to call the appropiate getTable based on tableName and registry type
// ----------------------------------------------
const getTable = async (tableName: string, where: any, sessions: iActiveSessions): Promise<any[]> => {
  switch (tableName) {
    case 'registries':
      return getRegistries(where, sessions)
    case 'namespaces':
      return getNamespaces(where, sessions)
    case 'repos':
      return getRepos(where, sessions)
    case 'images':
      return getImages(where, sessions)
    default:
      throw new Error(`Unknown table name '${tableName}'.`)
  }
}

// ----------------------------------------------
// Parse the SQL statement and perform the needed getTable
// ----------------------------------------------
export const query = async (sql: string, sessions: iActiveSessions): Promise<any[]> => {

  try {
    logger.info(`Request:${sql}`)

    // Parse query
    const ast = sqlparser.parse(sql)
    logger.info(`ACT:\n${JSON.stringify(ast)}`)

    // Support only SELECT statements
    if (ast.type !== 'select') {
      throw new Error(`Expected 'SELECT' statement but '${ast.type}' found.`)
    }

    // Hanldle the query and get result set
    const tableName = ast.from[0].table.toLowerCase()
    const data = await getTable(tableName, ast.where, sessions)

    // Handle the SELECT and rebuild result set
    ast.from[0].table = '?'
    const localSql = sqlparser.stringify(ast)
    const response = alasql(localSql, [data])

    // Publish the result set
    logger.info(`{ code:200, message: "Ok.", count: ${response.length} }`)
    return response

  } catch (err) {
    const msg = (err instanceof Error) ? (err as Error).message : err
    logger.error(msg)
    throw new Error(msg)
  }
}
