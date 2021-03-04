const {DynamoDBClient, QueryCommand, PutItemCommand, GetItemCommand, DeleteItemCommand} = require('@aws-sdk/client-dynamodb')
const {S3, PutObjectCommand} = require('@aws-sdk/client-s3')
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner')
const { required } = require('joi')
const Joi = require('joi')
const {v4:uuidv4} = require('uuid')

const region = 'us-west-1'
const TableName = 'MyHowm-Recipes'
const ddb = new DynamoDBClient({region})
const s3Client = new S3({region})

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

exports.imageUploadUrl = async (req, res) => {
    let name = req.query.name
    let type = req.query.type
    if(!name || !type) {
        return res.status(400).json({
            status: 'failure',
            message: 'query parameters name & type are required'
        })
    }

    try {
        const command = new PutObjectCommand({
            Bucket: 'myhowm.com-recipe-img',
            Key: `${Math.ceil(Math.random() * 10 ** 10)}-${name}`,
            ACL: 'public-read',
            ContentType: type
        })
        const signedUrl = await getSignedUrl(s3Client, command, {expiresIn: 3600})
        res.status(200).json({
            status: 'success',
            signedUrl
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'failure',
            message: error
        })
    }
}

exports.store = async (req, res) => {
    const body = req.body
    const schema = Joi.object({
        RecipeName: Joi.string().required(),
        Description: Joi.string().required(),
        ImgSrc: Joi.string().required(),
        Instructions: Joi.required(),
        Ingredients: Joi.required()
    })
    const {error, value} = schema.validate(body)
    if(error !== undefined) {
        res.status(400).json({
            status: 'failure',
            message: error.message
        })
        return
    }
            // RecipeName: item.RecipeName.S,
            // Description: item.Description.S,
            // Instructions: item.Instructions.L.map(i => i.S),
            // Ingredients,
            // ImgSrc: item.ImgSrc.S,
    const Item = {
        UserName: {S: req.user.UserName},
        RecipeName: {S: value.RecipeName},
        Description: {S: value.Description},
        ImgSrc: {S: value.ImgSrc},
        //Instructions,
        //Ingredients: 
    }
    try {
        await ddb.send(new PutItemCommand({TableName, Item}))
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
