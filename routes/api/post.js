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
        //WE USE ffind by if first instead of fineone and delete because we want to check if the post belongs to the current user first
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


//@path    PUT /api/posts/like/:id
//@desc    like a post
//@access  private

router.put('/like/:id', auth, async (req, res) => {

    try {

        //we do no need to use new keyword to create instance/document of model as we are querying the model
        //and returning the document and store it in post
        //WE USE NEW KEYWORD IF DOCUMENT HAS NOT BEEN CREATED/EXISTED

        //get post by post id
        const post = await Post.findById(req.params.id)

        //check if post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {

            return res.status(400).json({ msg: 'This post has already been liked' })
        }

        post.likes.unshift({ user: req.user.id })

        await post.save()

        res.json(post.likes)
    } catch (error) {
        console.log(error)

        res.status(500).send("server error")
    }

})

//@path    PUT /api/posts/unlike/:id
//@desc    unlike a post
//@access  private

router.put('/unlike/:id', auth, async (req, res) => {

    try {
        //get post by post id
        const post = await Post.findById(req.params.id)

        //check if post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {

            return res.status(400).json({ msg: 'This post has not been liked' })
        }

        //likes.map returns an array of user id and we get the index of user id that matches current user id (LOGGEDIN USER)
        //we use that index to remove the user id from the array 
        const removeIndex = post.likes.map(like => like.user).indexOf(req.user.id)

        post.likes.splice(removeIndex, 1)

        await post.save()

        res.json(post.likes)
    } catch (error) {
        console.log(error)

        res.status(500).send("server error")
    }

})

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post(
    '/comment/:id',
    [
        auth,
        [
            check('text', 'Text is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);

            await post.save();

            res.json(post.comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Pull out comment
        const comment = post.comments.find(
            comment => comment.id === req.params.comment_id
        );
        // Make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }
        // Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        post.comments = post.comments.filter(
            ({ id }) => id !== req.params.comment_id
        );

        await post.save();

        return res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;
