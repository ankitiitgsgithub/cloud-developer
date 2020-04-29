import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { parseUserId, getToken } from "../../auth/utils";
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODO_TABLE
const userIdIndex = process.env.USERID_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Get all TODO items for a current user
    const bearerToken = event.headers.Authorization
    const token = getToken(bearerToken)
    const userId = parseUserId(token)

    const result = await docClient.query({
        TableName: todosTable,
        IndexName: userIdIndex,
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames:{
            '#userId': 'userId'
        },
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()

    if (result.Count !== 0) {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result)
        }
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: 'No data found'
    }
}
