import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import * as AWS  from 'aws-sdk'

const todosTable = process.env.TODO_TABLE

const docClient = new AWS.DynamoDB.DocumentClient()

const logger = createLogger('updateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  logger.info(todoId)
  logger.info(updatedTodo)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  await docClient.update({
    TableName: todosTable,
    Key: { "todoId": todoId },
    UpdateExpression: 'set done = :doneValue',
    ExpressionAttributeValues:{
      ':doneValue': 'true'
    },
    ReturnValues:"UPDATED_NEW"
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify('')
  }
}
