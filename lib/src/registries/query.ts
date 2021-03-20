/// <reference path="../index.d.ts" />
import * as sqlparser from 'node-sqlparser'
import alasql from 'alasql'

import { iDockerQLResponse } from '..'

import { iActiveSessions } from './types'

import { getRegistries } from './registries'
import { getNamespaces } from './namespaces'
import { getRepos } from './repos'
import { getImages } from './images'

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
      throw new Error(`Unknown table name "${tableName}".`)
  }
}

// ----------------------------------------------
// Parse the SQL statement and perform the needed getTable
// ----------------------------------------------
export const query = async (sql: string, sessions: iActiveSessions): Promise<iDockerQLResponse> => {

  console.info(`Request:${sql}`)

  // Parse query
  const ast = sqlparser.parse(sql)
  console.info(`ACT:\n${JSON.stringify(ast)}`)

  // Support only SELECT statements
  if (ast.type !== 'select') {
    throw new Error (`Expected "SELECT" statement but "${ast.type}" found.` )
  }

  // Hanldle the query and get result set
  const tableName = ast.from[0].table.toLowerCase()
  const localResultSet = await getTable(tableName, ast.where, sessions)

  // Handle the SELECT and rebuild result set
  ast.from[0].table = '?'
  const localSql = sqlparser.stringify(ast)
  const resultSet = alasql(localSql, [localResultSet])

  // Publish the result set
  console.info(`{ code:200, message: "Ok.", count: resultSet.length`)
  return ({
    code: 200,
    msg: 'Ok.',
    count: resultSet.length,
    data: resultSet,
  })
}
