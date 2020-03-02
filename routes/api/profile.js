const express = require('express')
const router = express.Router()

//@path   /api/profile
//@desc   register user
//@acess  public

router.get('/', (req, res) => {
    res.send('profile')
})


module.exports = router;