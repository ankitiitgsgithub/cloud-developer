import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from "aws-sdk";
import { createLogger } from '../../utils/logger'

const todosTable = process.env.TODO_TABLE

const docClient = new AWS.DynamoDB.DocumentClient()

const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoIdToBeDeleted = event.pathParameters.todoId
  logger.info(todoIdToBeDeleted)

  // TODO: Remove a TODO item by id
  const result = await docClient.delete({
    TableName:todosTable,
    Key:{ "todoId": todoIdToBeDeleted }
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(result)
  }
}
