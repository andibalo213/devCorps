const express = require('express')
const app = express()

//DATABASE CONNECTION
const connectDB = require('./config/db')

connectDB()

//ROUTES
//APP.USE runs a middleware function at a specified path. first param is the path second param is the middleware function
app.use('/api/users', require('./routes/api/users'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})

app.get('/', (req, res) => {
    res.send('servesr started')
})