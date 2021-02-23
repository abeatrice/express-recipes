const Joi = require('joi')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY || 'jwtkey'
const {getUser, saveUser} = require('../models/user')

exports.register = async (req, res) => {
    // validate request body input
    const {error, value} = Joi.object({
        UserName: Joi.string().required(),
        Email: Joi.string().email().required(),
        Password: Joi.string().required()
    }).validate(req.body, {abortEarly: false})
    if(error !== undefined) {
        res.status(400).json({
            status: 'failure',
            message: error.message
        })
        return
    }

    let user = null
    try {
        user = await getUser(value.UserName)
    } catch (error) {
        //verified no user by username
    }

    if(user !== null) {
        res.status(400).json({
            status: 'failure',
            message: 'This User Name already exists.'
        })
        return
    }

    // create user
    const hashed_password = await bcrypt.hash(value.Password, 8)
    const token = jwt.sign({ID: value.UserName}, jwt_key)
    try {
        await saveUser({
            UserName: value.UserName,
            Email: value.Email,
            Password: hashed_password,
            Tokens: JSON.stringify([{Token: token}])
        })
        res.status(201).json({
            status: 'success',
            data: {
                UserName: value.UserName,
                Email: value.Email,
                Token: token
            }
        })
    } catch (error) {
        console.log('myhowm-api usersController register: ' + error)
        res.status(500).json({
            status: 'failure',
            message: 'failed to register user'
        })
    }
}

exports.login = async (req, res) => {
    // validate request body
    const {error, value} = Joi.object({
        UserName: Joi.string().required(),
        Password: Joi.string().required()
    }).validate(req.body)
    if(error !== undefined) {
        res.status(400).json({
            status: 'failure',
            message: error.message
        })
        return
    }

    // get user
    let user = {}
    try {
        user = await getUser(value.UserName)
    } catch (error) {
        console.log('myhowm-api usersController login: ' + error)
        res.status(403).json({
            status: 'failure',
            message: 'User not found'
        })
        return
    }

    // verify password
    const isPasswordMatch = await bcrypt.compare(value.Password, user.Password);
    if(!isPasswordMatch) {
        res.status(401).json({
            status: 'failure',
            message: 'Incorrect password'
        })
        return
    }

    // generate new jwt token
    const token = jwt.sign({ID: user.UserName}, jwt_key)
    let current_tokens = JSON.parse(user.Tokens)
    current_tokens.push({Token: token})
    const tokens = JSON.stringify(current_tokens)

    // save user's new tokens
    try {
        await saveUser({
            UserName: user.UserName,
            Email: user.Email,
            Password: user.Password,
            Tokens: tokens
        })
        res.status(200).json({
            status: 'success',
            data: {
                UserName: user.UserName,
                Email: user.Email,
                Token: token
            }
        })
    } catch (error) {
        console.log('myhowm-api usersController login: ' + error)
        res.status(500).json({
            status: 'failure',
            message: 'failed to login user'
        })
    }
}

exports.me = async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            UserName: req.user.UserName,
            Email: req.user.Email,
            Token: req.token
        }
    })
}

exports.logout = async (req, res) => {
    const Tokens = JSON.parse(req.user.Tokens).filter(token => {
        return token.Token != req.token
    })
    try {
        await saveUser({
            UserName: req.user.UserName,
            Email: req.user.Email,
            Password: req.user.Password,
            Tokens: JSON.stringify(Tokens),
        })
        res.status(200).json({
            status: 'success',
            message: 'user logged out'
        })
    } catch (error) {
        res.status(500).json({
            status: 'failure',
            message: 'failed to logout user'
        })
    }
}

exports.logoutAll = async (req, res) => {
    try {
        await saveUser({
            UserName: req.user.UserName,
            Email: req.user.Email,
            Password: req.user.Password,
            Tokens: JSON.stringify([]),
        })
        res.status(200).json({
            status: 'success',
            message: 'user logged out'
        })
    } catch (error) {
        res.status(500).json({
            status: 'failure',
            message: 'failed to logout user'
        })
    }
}
