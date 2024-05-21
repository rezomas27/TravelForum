const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    firstName: {
        type: String,
        required:true
    },
    lastName: {
        type: String,
        required:true
    },
    Email:{
        type: String,
        required:true
    },
    Password:{
        type: String,
        required: true
    }
}, {timestamps:true});

//get the token
userSchema.methods.jwtGenerateToken = function(){
    return jwt.sign({id: this.id}, process.env.JWT_SECRET,{
        expiresIn: 3600
    });
}


const User = mongoose.model('User',userSchema);

module.exports=User;