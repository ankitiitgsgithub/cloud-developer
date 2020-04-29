import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import {deleteTodos} from "../../service/dynamodb/todosOperation";

const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoIdToBeDeleted = event.pathParameters.todoId
  logger.info(todoIdToBeDeleted)

  // TODO: Remove a TODO item by id
  const result = await deleteTodos(todoIdToBeDeleted)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(result)
  }
}
