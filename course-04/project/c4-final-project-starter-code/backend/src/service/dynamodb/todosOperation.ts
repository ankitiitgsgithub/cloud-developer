import * as AWS  from 'aws-sdk'
import {DeleteItemOutput, QueryOutput} from "aws-sdk/clients/dynamodb";
import {CreateTodoRequest} from "../../requests/CreateTodoRequest";
import {TodoItem} from "../../models/TodoItem";

const todosTable = process.env.TODO_TABLE
const userIdIndex = process.env.USERID_INDEX
const docClient = new AWS.DynamoDB.DocumentClient()

export async function getTodos(userId: string): Promise<QueryOutput> {
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

    return result
}

export async function createTodos(todoId: string, userId: string, newTodoItem: CreateTodoRequest): Promise<TodoItem> {
    const item = {
        todoId: todoId,
        userId: userId,
        ...newTodoItem
    }

    await docClient.put({
        TableName: todosTable,
        Item: item
    }).promise()

    return item
}

export async function updateTodos(todoId: string): Promise<void> {
    await docClient.update({
        TableName: todosTable,
        Key: { "todoId": todoId },
        UpdateExpression: 'set done = :doneValue',
        ExpressionAttributeValues:{
            ':doneValue': 'true'
        },
        ReturnValues:"UPDATED_NEW"
    }).promise()
}

export async function deleteTodos(todoIdToBeDeleted: string): Promise<DeleteItemOutput> {
    const result = await docClient.delete({
        TableName:todosTable,
        Key:{ "todoId": todoIdToBeDeleted }
    }).promise()

    return result
}

export async function updateAttachmentUrl(todoId: string, signedUrlForGet: string): Promise<void> {
    await docClient.update({
        TableName: todosTable,
        Key: { "todoId": todoId },
        UpdateExpression: 'set attachmentUrl = :attachmentUrlValue',
        ExpressionAttributeValues:{
            ':attachmentUrlValue': signedUrlForGet
        },
        ReturnValues:"UPDATED_NEW"
    }).promise()
}

