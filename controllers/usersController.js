const {DynamoDBClient, PutItemCommand, GetItemCommand} = require('@aws-sdk/client-dynamodb')
const ddb = new DynamoDBClient({region: 'us-west-1'})
const Joi = require('joi')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY || 'jwtkey'
const {updateUser} = require('../models/user')

exports.register = async (req, res) => {
    const body = req.body
    const schema = Joi.object({
        UserName: Joi.string().required(),
        Email: Joi.string().required(),
        Password: Joi.string().required()
    })
    const {error, value} = schema.validate(body)
    if(error !== undefined) {
        res.status(400).json({
            status: 'failure',
            message: error.message
        })
        return
    }
    const hashed_password = await bcrypt.hash(value.Password, 8)
    const token = jwt.sign({ID: value.UserName}, jwt_key)
    const tokens = JSON.stringify([{Token: token}])
    const user = {
        UserName: {S: value.UserName},
        Email: {S: value.Email},
        Password: {S: hashed_password},
        Tokens: {S:tokens}
    }
    try {
        await ddb.send(new PutItemCommand({
            TableName: 'MyHowm-Users',
            Item: user
        }))
        res.status(201).json({
            status: 'success',
            data: {
                UserName: user.UserName.S,
                Email: user.Email.S,
                Token: token
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'failure',
            message: 'failed to register user'
        })
    }
}

exports.login = async (req, res) => {
    const body = req.body
    const schema = Joi.object({
        UserName: Joi.string().required(),
        Password: Joi.string().required()
    })
    const {error, value} = schema.validate(body)
    if(error !== undefined) {
        res.status(400).json({
            status: 'failure',
            message: error.message
        })
        return
    }
    const data = await ddb.send(new GetItemCommand({
        TableName: 'MyHowm-Users',
        Key: {
            UserName: {S: value.UserName}
        }
    }))
    if(data.Item === undefined) {
        res.status(403).json({
            status: 'failure',
            message: 'User not found'
        })
        return
    }
    const isPasswordMatch = await bcrypt.compare(value.Password, data.Item.Password.S);
    if(!isPasswordMatch) {
        res.status(401).json({
            status: 'failure',
            message: 'Incorrect password'
        })
        return
    }
    const token = jwt.sign({ID: value.UserName}, jwt_key)
    let current_tokens = JSON.parse(data.Item.Tokens.S)
    current_tokens.push({Token: token})
    const tokens = JSON.stringify(current_tokens)
    await ddb.send(new PutItemCommand({
        TableName: 'MyHowm-Users',
        Item: {
            UserName: {S: data.Item.UserName.S},
            Email: {S: data.Item.Email.S},
            Password: {S: data.Item.Password.S},
            Tokens: {S:tokens}
        }
    }))
    res.status(200).json({
        status: 'success',
        data: {
            UserName: data.Item.UserName.S,
            Email: data.Item.Email.S,
            Token: token
        }
    })
}

exports.logout = async (req, res) => {
    Tokens = JSON.parse(req.user.Tokens).filter(token => {
        return token.Token != req.token
    })
    await updateUser({
        UserName: req.user.UserName,
        Email: req.user.Email,
        Password: req.user.Password,
        Tokens: Tokens,
    })
    res.status(200).json({
        status: 'success',
        message: 'user logged out'
    })
}
