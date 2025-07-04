const mongoose = require('mongoose');

const UserSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type:String,
        required: true,
        unique: true,
        lowercase: true,

    },
    password: {
        type:String,
        required: true,
        minlength: 8,
    },
    profileImageUrl: {
        type:String,
        default: null,
    },
    role:{
        type:String,
        enum: ['admin', 'member'],
        default: 'member',

    },
},
    {
        timestamps: true,
    }

);

module.exports=mongoose.model("User",UserSchema);