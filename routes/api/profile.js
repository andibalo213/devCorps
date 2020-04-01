const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");
const config = require('config')
const axios = require('axios')

//@path   GET /api/profile/me
//@desc   get current user  profile
//@acess  private

router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        // only populate from user document if profile exists
        res.json(profile.populate('user', ['name', 'avatar']));
    } catch (error) {
        console.log(error.message);

        res.status(500).send("could not get porfile");
    }
});

//@path   POST /api/profile
//@desc   create/update user profile
//@acess  private


router.post(
    "/",
    [
        auth,
        [
            check("status", "Status is required")
                .not()
                .isEmpty(),
            check("skills", "skills are required")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //Extract fields input by user from req.body obj
        const {
            company,
            website,
            location,
            status,
            bio,
            githubusername,
            skills,
            youtube,
            twitter,
            facebook,
            linkedin,
            instagram
        } = req.body;

        //Create blank userprofile obj

        const profileFields = {};
        profileFields.user = req.user.id;

        //IF the fields is input by user insert it to profiel obj
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (status) profileFields.status = status;
        if (bio) profileFields.bio = bio;
        if (githubusername) profileFields.githubusername = githubusername;

        //skills is an array of string in the model and the user will input as comma spearated values
        //so we need to store it in the skills properties as array

        if (skills) {
            //we need to convert skills to string first because it is still type array of string
            profileFields.skills = skills.toString().split(",").map(skill => skill.trim());
        }

        //Socials is obj in model so we save build socials obj first then save it in the schema
        profileFields.social = {};

        //socials obj has to be declared first in profileFields otherwise when trying set
        //profileFields.social.youtube error social is undefined will appear because social obj inside profileFields
        //has not been declared

        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            //check if profile exists
            let profile = await Profile.findOne({ user: req.user.id });

            if (profile) {

                //if profile exists update profile
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id }, //find a profile document with the user id and return the document matching the condition
                    { $set: profileFields }, // with the return value as document, set the return document fields with the profileFields obj
                    { new: true, upsert: true } //new true returns the modified document
                    // Using upsert option (creates new doc if no match is found):
                );

                return res.json(profile);
            }

            //MODEL VS SCHEMA
            //schema is data structure of a documenet
            //model is ocnstructor compoiled from schema, used to create and read documents
            //instance of a model is called a document

            //if profile doesnt exist we create one
            //set profile as instance of Profile model and insert the profileFields obj into the Profile Model containing all the fields of
            //profile schema because it is a constructor function to create a document
            profile = new Profile(profileFields);

            //.save is used to save changes done to document
            await profile.save();

            return res.json(profile);
        } catch (error) {
            console.log(error.message);

            res.status(500).send("server error");
        }
    }
);

//@path   GET /api/profile
//@desc   get all profiles
//@acess  public

router.get("/", async (req, res) => {
    try {
        //POPULATE METHOd
        //populate is used to reference data from document in another collection to current document
        //in the current document we store an id refrencing another collection/model as a properti
        //when we call poopulate it will add on fields to the property containing the refrence id
        const profiles = await Profile.find().populate("user", ["name", "avatar"])


        if (!profiles) {
            return res.status(400).json({ msg: "Profiles not found" })
        }


        //When we callpopulate on a document it automatically fills the field with 
        //value as object with the fields we bring from another model
        return res.json(profiles);
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

//@path   GET /api/profile/user/:user_id
//@desc   get a user profile by user id
//@acess  public

router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate("user", ["name", "avatar"]);

        if (!profile) {
            return res.status(400).json({ msg: "this user profile doesnt exist" });
        }

        return res.json(profile);
    } catch (error) {
        //we check if the error type is obj id because if the obj id is valid it will retunr profile doesnt exists
        //but if not it will return server error. we want it to still return profile doesnt exists
        if (error.kind === "ObjectId") {
            return res.status(400).json({ msg: "this user profile doesnt exist" });
        }

        res.status(500).send("server error");
    }
});

//@path   DELETE /api/profile
//@desc   delete profile,user and posts
//@acess  private

router.delete("/", auth, async (req, res) => {
    try {
        await Post.deleteMany({ user: req.user.id })

        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });

        return res.json({ msg: "user has been deleted" });
    } catch (error) {
        res.status(500).send("server error");
    }
});

//@path   PUT /api/profile/experience
//@desc   add profile experience
//@acess  private

router.put(
    "/experience",
    [
        //In express validotr the check method first param is field that needs to be sent from the req obj
        //NOT inclusion in the profile model
        auth,
        [
            check("title", "title is required")
                .not()
                .isEmpty(),
            check("company", "company is required")
                .not()
                .isEmpty(),
            check("from", "from date is required")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //THE EXPERIENCE IS an array of obj within the profile document schema
        //beacuse one user can have many experience with each containing different fields

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title, //the same as title: title if property name is same as variable name
            company,
            location,
            from,
            to,
            current,
            description
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            //unshift adds the experience obj to the beginning of the array so the newest experience is
            //always at the start

            profile.experience.unshift(newExp);

            await profile.save();

            return res.json(profile);
        } catch (error) {
            res.status(500).send("server error");
        }
    }
);

//@path   DELETE /api/profile/experience/:experience_id
//@desc   delete user profile
//@acess  private

router.delete("/experience/:experience_id", auth, async (req, res) => {
    try {
        //we cannot do this because 1.expereince id is contained within array in profile.experience
        //2. findOne and remove will remove the whole document becuase it returns a document based on the selector/condition
        //await Profile.findOneAndRemove({ _id: req.params.experience_id });

        const profile = await Profile.findOne({ user: req.user.id });

        const removeIndex = profile.experience
            .map(item => item.id) //map through profile exp array and create a new array containing only the id of each obj in the array
            .indexOf(req.params.experience_id); //return the index in the new array matching the id in the query param

        //SPLICE METHOD
        //used to add/remove items from array. 1st param is where to start in the array, 2nd param is how amny items to remove, consequently are items to insert
        profile.experience.splice(removeIndex, 1);

        await profile.save()

        return res.json(profile);
    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).send("the user experience could not be found");
        }

        return res.status(500).send("server error");
    }
});

//@path   PUT /api/profile/education
//@desc   add profile education
//@acess  private

router.put(
    "/education",
    [
        auth,
        [
            check("school", "school is required")
                .not()
                .isEmpty(),
            check("degree", "degree is required")
                .not()
                .isEmpty(),
            check("fieldofstudy", "fieldofstudy is required")
                .not()
                .isEmpty(),
            check("from", "from date is required")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEdu);

            await profile.save();

            return res.json(profile);
        } catch (error) {
            console.log(error)
            res.status(500).send("server error");
        }
    }
);

//@path   DELETE /api/profile/education/:education_id
//@desc   delete user profile
//@acess  private

router.delete("/education/:education_id", auth, async (req, res) => {
    try {
        //we cannot do this because 1.expereince id is contained within array in profile.education
        //2. findOne and remove will remove the whole document becuase it returns a document based on the selector/condition
        //await Profile.findOneAndRemove({ _id: req.params.education_id });

        const profile = await Profile.findOne({ user: req.user.id });

        const removeIndex = profile.education
            .map(item => item.id) //map through profile exp array and create a new array containing only the id of each obj in the array
            .indexOf(req.params.education_id); //return the index in the new array matching the id in the query param

        //SPLICE METHOD
        //used to add/remove items from array. 1st param is where to start in the array, 2nd param is how amny items to remove, consequently are items to insert
        profile.education.splice(removeIndex, 1);

        await profile.save()

        return res.json(profile);
    } catch (error) {
        console.log(error)
        if (error.kind === "ObjectId") {
            return res.status(400).send("the user education could not be found");
        }

        return res.status(500).send("server error");
    }
});

//@path   GET /api/profile/github/:username
//@desc   get user github repos
//@acess  public

//IN THIS ROUTE we set our app route to vew user github repos
//but in this route we make a request to another web app using the request plugin
router.get('/github/:username', async (req, res) => {
    try {
        const uri = encodeURI(
            `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
        );
        const headers = {
            'user-agent': 'node.js',
            Authorization: `token ${config.get('githubToken')}`
        };

        const gitHubResponse = await axios.get(uri, { headers });
        return res.json(gitHubResponse.data);
    } catch (err) {
        console.error('github', err.message);
        return res.status(404).json({ msg: 'No Github profile found' });
    }
});

module.exports = router;
