const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

//@path   GET /api/profile/me
//@desc   get current user  profile
//@acess  private

router.get("/me", auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id }).populate(
            "user",
            ["name", "avatar"]
        );

        if (!profile) {
            return res.status(400).json({ msg: "User profile is not found" });
        }
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
            profileFields.skills = skills.split(',').map(skill => skill.trim());
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
                    { new: true } //new true returns the modified document
                );

                return res.json(profile)
            }

            //MODEL VS SCHEMA
            //schema is data structure of a documenet
            //model is ocnstructor compoiled from schema, used to create and read documents
            //instance of a model is called a document


            //if profile doesnt exist we create one
            //set profile as instance of Profile model and insert the profileFields obj into the Profile Model containing all the fields of 
            //profile schema because it is a constructor function to create a document
            profile = new Profile(profileFields)

            //.save is used to save changes done to document
            await profile.save()

            return res.json(profile)
        } catch (error) {
            console.log(error.message);

            res.status(500).send("server error");
        }
    }
);


//@path   GET /api/profile
//@desc   get all profiles
//@acess  public

router.get('/', async (req, res) => {
    try {

        //POPULATE METHOd
        //populate is used to reference data from document in another collection to current document
        //in the current document we store an id refrencing another collection/model as a properti
        //when we call poopulate it will add on fields to the property containing the refrence id
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])

        return res.json(profiles)
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
})

//@path   GET /api/profile/user/:user_id
//@desc   get a user profile by user id
//@acess  public

router.get('/user/:user_id', async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({ msg: 'this user profile doesnt exist' })
        }

        return res.json(profile)
    } catch (error) {

        //we check if the error type is obj id because if the obj id is valid it will retunr profile doesnt exists
        //but if not it will return server error. we want it to still return profile doesnt exists
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'this user profile doesnt exist' })
        }

        res.status(500).send('server error')
    }
})

module.exports = router;
