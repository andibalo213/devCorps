const express = require('express')
const app = express()

//DATABASE CONNECTION
const connectDB = require('./config/db')

connectDB()

//INIT BODY PARSER
//EXpress.json is a middleware that parses json request so we can get data from req.body object
app.use(express.json({ extended: false }))

//MIDDLEWARE FUNCtion are functions that has access to req,res and next.
// it can execute a code,modify req,res obj and end req,res cycle

//ROUTES
//APP.USE runs a middleware function at a specified path. first param is the path second param is the middleware function

//require imports a file as object but we export router as a function
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/post', require('./routes/api/post'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})

app.get('/', (req, res) => {
    res.send('servesr started')
})