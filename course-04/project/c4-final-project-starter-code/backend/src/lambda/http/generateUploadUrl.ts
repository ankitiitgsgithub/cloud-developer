import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger'

const todosTable = process.env.TODO_TABLE
const bucketName = process.env.TODO_S3_BUCKET

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4',
  params: {Bucket: bucketName}
})

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info(todoId)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const signedUrlForPut = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: 30000
  })

  const signedUrlForGet = s3.getSignedUrl('getObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: 30000
  })

  await docClient.update({
    TableName: todosTable,
    Key: { "todoId": todoId },
    UpdateExpression: 'set attachmentUrl = :attachmentUrlValue',
    ExpressionAttributeValues:{
      ':attachmentUrlValue': signedUrlForGet
    },
    ReturnValues:"UPDATED_NEW"
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      'uploadUrl': signedUrlForPut
    })
  }
}
