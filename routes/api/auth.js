const express = require('express')
const router = express.Router()

//@path   /api/auth
//@desc   register user
//@acess  public

router.get('/', (req, res) => {
    res.send('auth')
})


module.exports = router;