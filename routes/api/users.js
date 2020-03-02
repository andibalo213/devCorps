const express = require('express')
const router = express.Router()

//@path   /api/users
//@desc   register user
//@acess  public

router.get('/', (req, res) => {
    res.send('test')
})