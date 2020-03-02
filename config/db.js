//DB file is where the conenction to database lives

const mongoose = require('mongoose')
const config = require('config')

//CONFIG dependcy allows us to use the value of a variable globally with get in the project
const db = config.get('mongoURI')

//CONNECTDB Method to connect to mongo that will be called in server.js so we call export it as function

const connectDB = async () => {

    //ASYNC/AWAIT , we have to use try catch when using async await as we need error handler when things fail
    try {
        await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
        console.log('db conencted')
    } catch (error) {
        console.log(error)

        //exit process if fail
        process.exit(1)
    }
}

module.exports = connectDB