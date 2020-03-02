const express = require('express')
const router = express.Router()

//@path   /api/post
//@desc   register user
//@acess  public

router.get('/', (req, res) => {
    res.send('post')
})


module.exports = router;