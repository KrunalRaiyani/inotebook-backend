const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true,
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("notes",userSchema)
