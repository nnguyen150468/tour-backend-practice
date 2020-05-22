const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, "User must have a name"],
        trim: true
    },
    email: { 
        type: String,
        required: [true, "User must have an email"],
        trim: true,
        unique: true,
        validate: {
            validator(e){
                if(!validator.isEmail(e)) throw new Error("Invalid email")
            }
        }
    },
    password: { 
        type: String,
        required: [true, "User must have password"],
        trim: true
    },
    tokens: [String]
})

userSchema.pre("save", async function(next){
    console.log('this.isModified("password")',this.isModified("password"))
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, saltRounds)
    next()
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.__v
    delete userObject.password
    return userObject
}

userSchema.statics.findByCredentials = async function(email, password){
    console.log('thissss in userSchema statics', this)

    const user = await this.findOne({email: email})
    if(!user) throw new Error("User not found")
    const match = await bcrypt.compare(password.toString(), user.password)
    if(!match) throw new Error("User not found")
    return user
}

userSchema.methods.generateToken = async function(){
    const token = await jwt.sign({id: this._id}, process.env.SECRET, {expiresIn: "7d"})
    if(!this.tokens.includes(token)){
        if(this.tokens.length>5){
            this.tokens.shift()
        }
        this.tokens.push(token)
    }
    await this.save()
    return token
}

const User = mongoose.model("User", userSchema)
module.exports = User;