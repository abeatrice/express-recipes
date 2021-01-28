const {DynamoDBClient, QueryCommand, PutItemCommand} = require('@aws-sdk/client-dynamodb')
const ddb = new DynamoDBClient({region:'us-west-1'})
const TableName = 'MyHowm-Users'

exports.findUser = async (UserName, token) => {
    try {
        const data = await ddb.send(new QueryCommand({
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
        console.log(error)
        return null        
    }
}

exports.saveUser = async (user) => {
    try {
        await ddb.send(new PutItemCommand({
            TableName: TableName,
            Item: {
                UserName: {S: user.UserName},
                Email: {S: user.Email},
                Password: {S: user.Password},
                Tokens: {S: user.Tokens},
            }
        }))
    } catch (error) {
        console.log(error)
        throw error
    }
}

