const jwt = require('jsonwebtoken')
const config = require('config')

//AUTH MIDDLEWARE
//is used to protecct route so it runs before the callback function of a specified route
//to verify if the user/client has a valid token

module.exports = function (req, res, next) {

    //Get Token From Header
    //token is stored in req.haeder obj with key x-auth-token
    const token = req.header('x-auth-token')

    //Check if token exists

    if (!token) {
        return res.status(401).json({ msg: "No token found" })
    }

    try {
        //Decode the token and get the suer id from within it
        const decoded = jwt.verify(token, config.get('jwtSecret'))

        //The decoded user id is stored in the req obj with key user when it is assigned to decoded, the assigned value is user.id, 
        //Hence to access the id we do decoded.user
        // REQ OBJ is used to store user id because it is accessible to all middleware function including router callback func
        req.user = decoded.user

        //NEXT is a method to pass the control to the next middleware function
        next()
    } catch (error) {
        console.log(error)

        res.status(401).json({ msg: 'token is invalid' })
    }
}