import 'source-map-support/register'
import * as AWS from 'aws-sdk'
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
  const todoId = event.pathParameters.todoId

  await docClient
    .delete({
      TableName: todosTable,
      Key: {
        todoId: todoId
      }
    })
    .promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: 'Item removed'
  }
}
