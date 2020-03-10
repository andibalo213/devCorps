const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

//@path   POST /api/posts
//@desc   create a post
//@acess  private

router.post(
    "/",
    [
        auth,
        [
            check("text", 'text is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array() })
        }

        try {

            const user = await User.findById(req.user.id).select('-password')

            //WE GET the user document on the user model beacuse we will use the properties inside as VALUES in the
            //POST document

            const newPost = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }

            const post = new Post(newPost)

            await post.save()

            return res.json(post)

        } catch (error) {
            console.log(error)

            return res.status(500).send('server error')
        }
    }
);

//@path    GET /api/posts
//@desc    get all posts
//@access  private

router.get('/', auth, async (req, res) => {

    try {
        //find method returns all document in the collection/model
        //sort, sorts the document by date. if date -1 then is by newest, 1 by oldest (default)
        const posts = await Post.find().sort({ date: -1 })

        return res.json(posts)
    } catch (error) {
        console.log(error)

        res.status(500).send("server error")
    }
})

//@path    GET /api/posts/:id
//@desc    get a post by id
//@access  private

router.get('/:id', auth, async (req, res) => {

    try {

        const post = await Post.findById(req.params.id)

        if (!post) {

            return res.send(404).json({ msg: "post not found" })
        }

        return res.json(post)
    } catch (error) {
        console.log(error)

        if (error.kind === 'ObjectId') {
            return res.send(404).json({ msg: "post not found" })
        }

        res.status(500).send("server error")
    }
})

//@path    DELETE /api/posts/:id
//@desc    delete a post
//@access  private

router.delete('/:id', auth, async (req, res) => {

    try {

        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.send(404).json({ msg: "post not found" })
        }

        //post.user is not string, is type Objectid in the model so we need to convert it to string bcs req.user.id is a string
        if (post.user.toString() !== req.user.id) {
            return res.send(401).json({ msg: "Not Authorized" })
        }

        //remove method on the document removes this document
        await post.remove()

        return res.json({ msg: "post removed" })
    } catch (error) {
        console.log(error)

        if (error.kind === 'ObjectId') {
            return res.send(404).json({ msg: "post not found" })
        }

        res.status(500).send("server error")
    }
})

module.exports = router;
