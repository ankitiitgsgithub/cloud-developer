import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import {updateAttachmentUrl} from "../../service/dynamodb/todosOperation";
import {getSignedUrlForGet, getSignedUrlForPut} from "../../service/s3/todosOperation";

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info(todoId)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const signedUrlForPut = getSignedUrlForPut(todoId)
  const signedUrlForGet = getSignedUrlForGet(todoId)

  await updateAttachmentUrl(todoId, signedUrlForGet)

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
