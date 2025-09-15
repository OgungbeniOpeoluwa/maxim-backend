const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: [true,"firstName is required"]
    },
    lastName: {
        type: String,
        required: [true,"lastName is required"]
    },
    email:{
        type: String,
        required: [true,"email is required"],
        unique: true
    },
    password:{
        type: String,
        require: [true,"password is required"]

    },
    virtualAccountNumber: {
        type: String,
        default:""
    },
},
    {
        timestamps: true, 
    }
)

module.exports = mongoose.model("User",userSchema)