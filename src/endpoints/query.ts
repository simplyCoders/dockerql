import * as express from 'express'
/* eslint-disable */
// @ts-ignore
import * as sqlparser from 'node-sqlparser'
/* eslint-enable */
import alasql from 'alasql'

import { verbose } from '../config'
import { getTable } from '../registries'

// Perform query
export const query = async (req: express.Request, res: express.Response) => {
  // Get the query parameter
  const { sql } = req.query
  if (typeof (sql) === 'undefined') {
    res.status(400)
    res.json({ code: 400, message: 'Expected a "sql" query parameter.' })
    return
  }

  console.info(`Request:${sql}`)

  // Parse query
  try {
    const ast = sqlparser.parse(sql)
    verbose(`ACT:\n${JSON.stringify(ast)}`)

    // Support only SELECT statements
    if (ast.type !== 'select') {
      res.status(400)
      res.json({ code: 400, message: `Expected "SELECT" statement but "${ast.type}" found.` })
      return
    }

    // Hanldle the query and get result set
    const tableName = ast.from[0].table.toLowerCase()
    const localResultSet = await getTable(tableName, ast.where)

    // Handle the SELECT and rebuild result set
    ast.from[0].table = '?'
    const localSql = sqlparser.stringify(ast)
    const resultSet = alasql(localSql, [localResultSet])

    // Publish the result set
    res.status(200)
    res.json({
      code: 200,
      message: 'Query executed successfully.',
      count: resultSet.length,
      data: resultSet,
    })
  } catch (err) {
    const code = typeof (err.code) !== 'undefined' ? err.code : 400
    const msg = typeof (err.message) !== 'undefined' ? err.message : 'Internal error.'
    res.status(code)
    res.json({ code, message: msg })
  }
}
