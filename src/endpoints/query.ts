"use strict"
import * as express from "express"
import * as sqlparser from "node-sqlparser"

const tables = ["pods", "cluster-info"]
// Perform query
export const query = (req: express.Request, res: express.Response) => {

        // Get the query parameter
        const sql = req.query.query
        console.log("query:" + sql)

        // Parse query
        try {
                const ast = sqlparser.parse(sql)
                console.log(ast)

                // support only SELECT statements
                if (ast.type !== "select") {
                        res.status(400)
                        res.json({ code: 400, message: "Expected \"SELECT\" statement but \""+ ast.type +"\" found." })
                        return
                }

                // support only SELECT statements
                if (tables.find(ast.from[0].table)) {
                        res.status(404)
                        res.json({ code: 404, message: "Table \""+ ast.from[0].table +"\" not found." })
                        return
                }

        } catch (err) {
                res.status(400)
                res.json({ code: 400, message: err.message})
                return
        }

        res.json({ message: "Hello World!" })
}
