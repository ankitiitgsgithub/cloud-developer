import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserIdFromToken } from "../../auth/utils";
import {getTodos} from "../../service/dynamodb/todosOperation";
import {getResponse} from "../../businesslogic/TodoResponse";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Get all TODO items for a current user
    const bearerToken = event.headers.Authorization
    const userId = getUserIdFromToken(bearerToken)

    const result = await getTodos(userId)

    return getResponse(result)
}
