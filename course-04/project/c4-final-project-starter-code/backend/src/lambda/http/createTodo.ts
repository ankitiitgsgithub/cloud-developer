import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import { getUserIdFromToken } from "../../auth/utils";
import { createLogger } from '../../utils/logger'
import { createTodos } from "../../service/dynamodb/todosOperation";

const logger = createLogger('createToDo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodoItem: CreateTodoRequest = JSON.parse(event.body)
  logger.info(newTodoItem)

  const bearerToken = event.headers.Authorization
  const userId = getUserIdFromToken(bearerToken)
  const todoId = uuid.v4()

  const item = await createTodos(todoId, userId, newTodoItem)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}
