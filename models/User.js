const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})


//MONGOOSE.MODEL takes in a schema which is a document data strucutre and create an instance of that document
//in this case USER. first param is document/collection name in db and second param is the schema
//WE can use the User instance to interact/query with the document in the database
module.exports = User = mongoose.model('user', UserSchema)