/// <reference path="./node-sqlparser.d.ts" />
import * as sqlparser from 'node-sqlparser'
import alasql from 'alasql'

import { iActiveSessions } from './types'

import { getRegistries } from './registries'
import { getNamespaces } from './namespaces'
import { getRepos } from './repos'
import { getImages } from './images'
import * as logger from '../helpers/logger'
import { Response, DQLError } from '../types'

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
      throw { code: 400, message: `Unknown table name "${tableName}".` } as DQLError
  }
}

// ----------------------------------------------
// Parse the SQL statement and perform the needed getTable
// ----------------------------------------------
export const query = async (sql: string, sessions: iActiveSessions): Promise<Response> => {

  try {
    logger.info(`Request:${sql}`)

    // Support only SELECT statements
    if (typeof sql !== "string" || sql === '') {
      throw { code: 400, message: `SQL statement can not be empty.` } as DQLError
    }

    // Parse query
    let ast: any = {}
    try {
      ast = sqlparser.parse(sql)
      logger.info(`ACT:\n${JSON.stringify(ast)}`)
    } catch (err) {
      throw { code: 400, message: err.message } as DQLError
    }

    // Support only SELECT statements
    if (ast.type !== 'select') {
      throw { code: 400, message: `Expected 'SELECT' statement but '${ast.type}' found.` } as DQLError
    }

    // Hanldle the query and get result set
    const tableName = ast.from[0].table.toLowerCase()
    const data = await getTable(tableName, ast.where, sessions)

    // Handle the SELECT and rebuild result set
    ast.from[0].table = '?'
    const localSql = sqlparser.stringify(ast)
    const response = alasql(localSql, [data])

    // Publish the result set
    logger.info(`Ok, results count: ${response.length}`)
    return { code: 200, message: 'Ok.', data: response }

  } catch (err) {
    logger.error(err)
    const dqlErr = err as DQLError
    if (typeof dqlErr.code !== "undefined") {
      throw { code: dqlErr.code, message: dqlErr.message } as DQLError
    } else {
      throw { code: 400, message: `Bad request.` } as DQLError
    }
  }
}
