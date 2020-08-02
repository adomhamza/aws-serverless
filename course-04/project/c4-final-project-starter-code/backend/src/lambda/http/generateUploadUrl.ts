import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  console.log(todoId)
  //TODO: env
  const bucket = process.env.S3_BUCKET
  const url_exp = process.env.SIGNED_URL_EXPIRATION
  const todosTable = process.env.TABLE_TODOS

  const imageId = uuid.v4()

  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })

  const url = s3.getSignedUrl('putObject', {
    Bucket: bucket,
    Key: imageId,
    Expires: url_exp
  })

  const imageUrl = `https://${bucket}.s3.amazonaws.com/${imageId}`

  const updateUrlOnTodo = {
    TableName: todosTable,
    Key: { todoId: todoId },
    UpdateExpression: 'set attachmentUrl = :a',
    ExpressionAttributeValues: {
      ':a': imageUrl
    },
    ReturnValues: 'UPDATED_NEW'
  }

  await docClient.update(updateUrlOnTodo).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      iamgeUrl: imageUrl,
      uploadUrl: url
    })
  }
}
