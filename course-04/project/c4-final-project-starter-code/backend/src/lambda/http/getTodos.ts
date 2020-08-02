import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { parseUserId } from '../../auth/utils'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

const docClient = new AWS.DynamoDB.DocumentClient()
//TODO: env
const todosTable = process.env.TABLE_TODOS

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('EVENT:', event)

  const authHeader = event.headers.Authorization
  const authSplit = authHeader.split(' ')
  const userId = parseUserId(authSplit[1])

  const result = await docClient
    .query({
      TableName: todosTable,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },

      ScanIndexForward: false
    })
    .promise()

  const items = result.Items

  // TODO: Get all TODO items for a current user
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
