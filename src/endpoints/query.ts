"use strict"
import * as express from "express"
import * as sqlparser from "node-sqlparser"
import {getTable} from "../registries"

// Perform query
export const query = async (req: express.Request, res: express.Response) => {

        // Get the query parameter
        const sql = req.query.query
        console.log("Request:" + sql)

        // Parse query
        try {
                const ast = sqlparser.parse(sql)
                console.log("ACT:\n",ast)

                // support only SELECT statements
                if (ast.type !== "select") {
                        res.status(400)
                        res.json({ code: 400, message: "Expected \"SELECT\" statement but \""+ ast.type +"\" found." })
                        return
                }

                // perform the query
                const tableName = ast.from[0].table.toLowerCase()
                const resultSet = await getTable(tableName, ast.where)
                res.status(200)
                res.json({
                        code: 200,
                        message: "Query executed successfully.",
                        count: resultSet.length,
                        data: resultSet
                })
                return resultSet

        } catch (err) {
                const code = typeof(err.code)!=="undefined" ? err.code : 400
                const msg = typeof(err.message)!=="undefined" ? err.message : "Internal error."
                res.status(code)
                res.json({ code, message: msg})
                return
        }
}
