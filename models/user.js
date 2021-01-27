const {DynamoDBClient, QueryCommand, PutItemCommand} = require('@aws-sdk/client-dynamodb')
const dbb = new DynamoDBClient({region:'us-west-1'})
const TableName = 'MyHowm-Users'

exports.findUser = async (UserName, token) => {
    try {
        const data = await dbb.send(new QueryCommand({
            TableName: TableName,
            KeyConditionExpression: "UserName = :UserName",
            FilterExpression: "contains (Tokens, :token)",
            ExpressionAttributeValues: {
                ":UserName": {S: UserName},
                ":token": {S: token}
            }
        }))
        return {
            UserName: data.Items[0].UserName.S,
            Email: data.Items[0].Email.S,
            Password: data.Items[0].Password.S,
            Tokens: data.Items[0].Tokens.S,
        }
    } catch (error) {
        return null        
    }
}

exports.updateUser = async (user) => {
    await data 
}
