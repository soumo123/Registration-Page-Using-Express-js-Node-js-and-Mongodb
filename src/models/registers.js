const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// creating schema
const studentRegistrationSchema = new mongoose.Schema({
    firstname :{
        type:String, 
        required:true
    },
    lastname :{
        type:String, 
        required:true
    },
    email :{
        type:String,
        require:true,
        unique:true
    },
    gender :{
        type:String, 
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    age:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

studentRegistrationSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id)
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token;
        
    } catch (error) {
        res.send("The error part"+error)
        console.log("The error part"+error)
    }
}




studentRegistrationSchema.pre("save", async function(next){

    if(this.isModified("password")){
        // console.log(`the current password is ${this.password}`)
        this.password = await bcrypt.hash(this.password,10)
        // console.log(`the current password is ${this.password}`)
        this.confirmpassword = await bcrypt.hash(this.password,10)
    }
    next();
})



//creating collections or mdel//

const Register = new  mongoose.model("Register",studentRegistrationSchema)

module.exports = Register