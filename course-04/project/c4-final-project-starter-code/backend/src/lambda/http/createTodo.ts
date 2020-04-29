import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import {getToken, parseUserId} from "../../auth/utils";
import { createLogger } from '../../utils/logger'

const todosTable = process.env.TODO_TABLE

const docClient = new AWS.DynamoDB.DocumentClient()

const logger = createLogger('createToDo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodoItem: CreateTodoRequest = JSON.parse(event.body)
  logger.info(newTodoItem)

  const bearerToken = event.headers.Authorization
  const token = getToken(bearerToken)
  const userId = parseUserId(token)

  const todoId = uuid.v4()

  const newTodo = {
    todoId: todoId,
    userId: userId,
    ...newTodoItem
  }

  // TODO: Implement creating a new TODO item
  await docClient.put({
    TableName: todosTable,
    Item: newTodo
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newTodo
    })
  }
}
