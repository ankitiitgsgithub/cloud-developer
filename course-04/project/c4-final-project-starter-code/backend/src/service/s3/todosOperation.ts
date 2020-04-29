import * as AWS from 'aws-sdk'

const bucketName = process.env.TODO_S3_BUCKET

const s3 = new AWS.S3({
    signatureVersion: 'v4',
    params: {Bucket: bucketName}
})

export function getSignedUrlForPut(todoId: string): string {
    const signedUrlForPut = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: 30000
    })

    return signedUrlForPut
}

export function getSignedUrlForGet(todoId: string): string {
    const signedUrlForGet = s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: 30000
    })

    return signedUrlForGet
}
