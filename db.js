const mongoose = require("mongoose");
require('dotenv').config()

const mongoURI = process.env.MONGO_URI


const connectToMongo = async()=>{
try {
    await  mongoose.connect(mongoURI)
} catch (error) {
    console.error(error)
}
  
    
}

module.exports = connectToMongo;