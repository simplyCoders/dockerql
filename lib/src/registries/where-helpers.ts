import { DQLError } from '../types'

// ----------------------------------------------
// Helper function: Break a simple where clause and extract column name and value
// Make validation for everything and make sure the column is in the list of supportedColumns
// ----------------------------------------------
const analyzeSimpleWhere = (where: any, supportedColumns: string[], throwMessage: DQLError) => {
  // where clause must not be empty
  if (where === null) {
    throw (throwMessage as DQLError)
  }
  // operator must be "="
  if (where.operator !== '=') {
    throw (throwMessage as DQLError)
  }

  // comarison must be between a column and a string
  if (!((where.left.type === 'column_ref' && where.right.type === 'string')
    || (where.left.type === 'string' && where.right.type === 'column_ref'))) {
      throw (throwMessage as DQLError)
    }

  // get column name and comparion value
  const column = (where.left.type === 'column_ref') ? where.left.column.toLowerCase() : where.right.column.toLowerCase()
  const value = (where.left.type === 'string') ? where.left.value : where.right.value

  // column must be one of the supportedColumns
  if (!supportedColumns.includes(column)) {
    throw (throwMessage)
  }

  const result: any = {}
  result[column] = value
  return result
}

// ----------------------------------------------
// Helper function: Scan an entire where clause for column names and comparison values
// ----------------------------------------------
export const analyzeWhere = (where: any, supportedColumns: string[], throwMessage: DQLError): any => {
  if (where === null) {
    return {}
  }

  if (where.operator === 'AND') {
    return Object.assign(
      analyzeWhere(where.left, supportedColumns, throwMessage),
      analyzeWhere(where.right, supportedColumns, throwMessage),
    )
  }

  return analyzeSimpleWhere(where, supportedColumns, throwMessage)
}
