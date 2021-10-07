const jwt = require('jsonwebtoken');
const Register = require('../models/registers');


const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt
        const VerifyUser = jwt.verify(token,process.env.SECRET_KEY)
        const user = await Register.findOne({_id:VerifyUser._id})
        console.log(user)

        req.token = token
        req.user = user
        next();
        // console.log(VerifyUser)

    } catch (error) {
        res.render("error")
    }
}
module.exports = auth;