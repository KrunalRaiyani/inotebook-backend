const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

connectToMongo()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port,()=>{
    // console.log("iNotebook backend run on port " + port)
})