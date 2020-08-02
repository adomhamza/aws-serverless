import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import * as AWS from 'aws-sdk'

import * as uuid from 'uuid'
import { parseUserId } from '../../auth/utils'

const docClient = new AWS.DynamoDB.DocumentClient()
//TODO: env
const todosTable = process.env.TABLE_TODOS

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const todoId = uuid.v4()
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const authHeader = event.headers.Authorization
  const authSplit = authHeader.split(' ')
  const token = authSplit[1]

  console.log('test', token)

  const item = {
    todoId: todoId,
    userId: parseUserId(token),
    ...newTodo
  }

  await docClient
    .put({
      TableName: todosTable,
      Item: item
    })
    .promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  }
}
