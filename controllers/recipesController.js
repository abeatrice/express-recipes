const {DynamoDBClient, QueryCommand, PutItemCommand, GetItemCommand, DeleteItemCommand} = require('@aws-sdk/client-dynamodb')
const ddb = new DynamoDBClient({region: 'us-west-1'})
const {v4:uuidv4} = require('uuid')
const Joi = require('joi')
const TableName = 'MyHowm-Recipes'

exports.index = async (req, res) => {
    const data = await ddb.send(new QueryCommand({
        ProjectionExpression: "RecipeName, Description, Ingredients, Instructions, ImgSrc",
        TableName,
        KeyConditionExpression: "UserName = :UserName",
        ExpressionAttributeValues: {
            ":UserName": {S: req.user.UserName}
        }
    }))
    const items = data.Items.map(item => {
        let Ingredients = {}
        for (const ingredient in item.Ingredients.M) {
            Ingredients[ingredient] = item.Ingredients.M[ingredient].S
        }
        return {
            RecipeName: item.RecipeName.S,
            Description: item.Description.S,
            Instructions: item.Instructions.L.map(i => i.S),
            Ingredients,
            ImgSrc: item.ImgSrc.S,
        }
    })
    res.status(200).json({
        status: 'success',
        data: items
    })
}

exports.store = async (req, res) => {
    const body = req.body
    const schema = Joi.object({
        Name: Joi.string().required(),
        Description: Joi.string().required()
    })
    const {error, value} = schema.validate(body)
    if(error !== undefined) {
        res.status(400).json({
            status: 'failure',
            message: error.message
        })
        return
    }
    const item = {
        ID: {S: uuidv4()},
        Name: {S: value.Name},
        Description: {S: value.Description}
    }
    try {
        await ddb.send(new PutItemCommand({
            TableName: 'MyHowm-Recipes',
            Item: item
        }))
        res.status(201).json({
            status: 'success',
            data: {
                ID: item.ID.S,
                Name: item.Name.S,
                Description: item.Description.S
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'failure',
            message: 'failed to create recipe'
        })
    }
}

exports.show = async (req, res) => {
    try {
        const data = await ddb.send(new GetItemCommand({
            TableName: 'MyHowm-Recipes',
            Key: {
                ID: {S: req.params.id}
            }
        }))
        res.status(200).json({
            status: 'success',
            data: {
                ID: data.Item.ID.S,
                Name: data.Item.Name.S,
                Description: data.Item.Description.S
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'failure',
            message: 'failed to get recipe'
        })
    }
}

exports.update = async (req, res) => {
    const body = req.body
    const schema = Joi.object({
        Name: Joi.string().required(),
        Description: Joi.string().required()
    })
    const {error, value} = schema.validate(body)
    if(error !== undefined) {
        res.status(400).json({
            status: 'failure',
            message: error.message
        })
        return
    }
    const item = {
        ID: {S: req.params.id},
        Name: {S: value.Name},
        Description: {S: value.Description}
    }
    try {
        await ddb.send(new PutItemCommand({
            TableName: 'MyHowm-Recipes',
            Item: item
        }))
        res.status(200).json({
            status: 'success',
            data: {
                ID: item.ID.S,
                Name: item.Name.S,
                Description: item.Description.S
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'failure',
            message: 'failed to update recipe'
        })
    }
}

exports.destroy = async (req, res) => {
    try {
        await ddb.send(new DeleteItemCommand({
            TableName: 'MyHowm-Recipes',
            Key: {
                ID: {S: req.params.id}
            }
        }))
        res.status(200).json({
            status: 'success',
            message: 'recipe deleted'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'failure',
            message: 'failed to delete recipe',
        })
    }
}
