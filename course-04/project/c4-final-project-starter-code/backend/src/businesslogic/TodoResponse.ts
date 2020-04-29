import {APIGatewayProxyResult} from "aws-lambda";
import {QueryOutput} from "aws-sdk/clients/dynamodb";


export function getResponse(result: QueryOutput): APIGatewayProxyResult {
    if (result.Count !== 0) {
        const items = {
            items: result.Items
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(items)
        }
    }

    const emptyItems = {
        items: ''
    }

    return {
        statusCode: 404,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(emptyItems)
    }
}
