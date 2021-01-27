const jwt = require('jsonwebtoken')
const jwt_key = process.env.JWT_KEY || 'jwtkey'
const {findUser} = require('../models/user')

exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const jwt_data = jwt.verify(token, jwt_key)
        const user = await findUser(jwt_data.ID, token)
        if(!user) {
            res.status(401).send({
                status: 'failure',
                message: 'Not Authorized to access this resource'
            })
            return
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({
            status: 'failure',
            message: 'Not Authorized to access this resource'
        })    
    }
}
