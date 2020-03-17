const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')

//@path   /api/auth
//@desc   return user
//@acess  private

//PROTECTED Route because it runs the auth middleware to check token first
router.get('/', auth, async (req, res) => {
    try {

        //finds user data by id and returns user document without the password
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.log(error)

        res.status(500).send('server error')
    }
})

//@path   POST /api/auth
//@desc   login user
//@acess  public

//LOGIN USER ROUTE is similiar to register difference only need emaila nd password and we check
//the inputted password with encrypted pass in database.

//EXPRESS VALIDATOR is a middleware function that checks incoming data from req.body obj
//if one of the check is false it goes to the errors array available in .array() method
//it is USED to valdiate if the input from user is correct
router.post('/', [
    check('email', 'email is required').isEmail(),
    check('password', 'password is required').exists()
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {

        //FINDONE query method finds a document based on a selector in this case email
        //Checks if user alrdy exists
        let user = await User.findOne({ email: email })

        if (!user) {
            //we want the error to match the express-validotr error msg array
            //so in the frontend the type of error is the same
            return res.status(400).json({ errors: [{ msg: 'invalid credentials' }] })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ msg: 'Password is invalid' })
        }

        //Create jsonwebtoken

        //PAYLOAD STRUCTURE
        //we structure the payload like this so when it is decoded we can access id by user.id
        //because when it is decoded the obj of payload will be reassigned to the req.header. (Not paylod.user.id)
        const payload = {
            user: {
                id: user.id // even though its _id in the document, with mongoose abstraction we can just type id
            }
        }

        //JWT is used to protect routes so we can check if user is authorized or not based on avaialble token using auth middleware function
        //it also has payload that contains user id which we can decode to identify a specific user
        jwt.sign(payload, config.get('jwtSecret'), (err, token) => {

            if (err) throw err;
            res.json({ token })
        })

    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }

})

module.exports = router;