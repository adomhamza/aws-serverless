import 'source-map-support/register'
import * as AWS from 'aws-sdk'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  //TODO: env
  const todosTable = process.env.TABLE_TODOS

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

  //const authHeader = event.headers.Authorization
  //const authSplit = authHeader.split(" ")
  //const token = authSplit[1]

  const updateTodoParams = {
    TableName: todosTable,
    Key: { todoId: todoId },
    UpdateExpression: 'set #n = :a, dueDate = :b, done = :c',
    ExpressionAttributeValues: {
      ':a': updatedTodo['name'],
      ':b': updatedTodo.dueDate,
      ':c': updatedTodo.done
    },
    ExpressionAttributeNames: {
      '#n': 'name'
    },
    ReturnValues: 'UPDATED_NEW'
  }

  const runthis = await docClient.update(updateTodoParams).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      runthis
    })
  }
}
