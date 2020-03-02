const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

//@path   POST /api/users
//@desc   register user
//@acess  public

//EXPRESS VALIDATOR is a middleware function that checks incoming data from req.body obj
//if one of the check is false it goes to the errors array available in .array() method
router.post('/', [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'email is required').isEmail(),
    check('password', 'password with minial length 6 is required').isLength({ min: 6 })
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body;

    try {

        //FINDONE query method finds a document based on a selector in this case email
        //Checks if user alrdy exists
        let user = await User.findOne({ email: email })

        if (user) {
            //we want the error to match the express-validotr error msg array
            //so in the frontend the type of error is the same
            return res.status(400).json({ errors: [{ msg: 'user already exists' }] })
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })


        //Create an instance of User collection/Model to access the User document
        //We can pass values to the field of user schema by giving it an obj of values 
        user = new User({
            name, //the same as name: name
            email,
            avatar,
            password
        })

        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt)

        await user.save()

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