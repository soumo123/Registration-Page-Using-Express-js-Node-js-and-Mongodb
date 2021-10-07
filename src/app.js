require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
const{ json } = require('express')
const Register = require('./models/registers');
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('./db/conn')
const auth = require('./middleware/auth')


const port = process.env.PORT ||8000


//import the indx.html page///////////////
const static_path = path.join(__dirname, '../public')
const template_path = path.join(__dirname, '../templates/views')
const partial_path = path.join(__dirname, '../templates/partials')
app.use(express.static(static_path))
app.set("view engine","hbs")
app.set("views",template_path);
hbs.registerPartials(partial_path)

app.use(express.json())
app.use(express.urlencoded({ extended:false }))
app.use(cookieParser())




console.log(process.env.SECRET_KEY)
app.get('/', (req, res) =>{
    res.render("index")
})

app.get('/about', auth ,(req, res) =>{
    // console.log(`the cookie is ${req.cookies.jwt}`)
    res.render("about")
})

app.get('/logout', auth ,async(req, res) =>{

    try {
        // req.user.tokens = req.user.tokens.filter((currentElement)=>{
        //     return currentElement.token !== req.token
        // })
        console.log(req.user)
        req.user.tokens = [];
        res.clearCookie("jwt")
        console.log("logout succesfully")
        await req.user.save()
        res.render("login")
        
    } catch (error) {
        res.render("error")
    }
})





app.get('/register', (req, res) =>{
    res.render("register")
})

app.post('/register', async(req, res) =>{
    try{
        const password= req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password===cpassword){
            const StudentDataGettingProcess = new Register({
                firstname:req.body.firstname,
                lastname :req.body.lastname,
                email:req.body.email,
                gender:req.body.gender,
                phone:req.body.phone,
                age:req.body.age,
                password:password,
                confirmpassword: cpassword
            })

            console.log(" success part is" + StudentDataGettingProcess)
            const token = await StudentDataGettingProcess.generateAuthToken();
            console.log("token part is : " + token)
            

            //store the token in cookies// syntax =====> res.cookie(name,value,[options])

            res.cookie("jwt",token,{ 
                expires:new Date(Date.now()+1000000),
                // httpOnly:true
            })
            // console.log(cookie)
            const registereddata = await StudentDataGettingProcess.save();
            console.log(registereddata)
            // console.log("the final part is :" + result)
            res.status(201).render("index")
            
        }else{
            // res.send("Password not matching")
            res.render("error")
        }
    }catch(e){
        res.status(404).send(e)
    }
})


app.get('/login', (req, res) =>{
    res.render("login")
})


app.get('/error', (req, res) =>{
    res.render("error")
})

// login check///



app.post('/login', async(req, res) =>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email})

        const isMatch = bcrypt.compare(password,useremail.password)
        const token = await useremail.generateAuthToken();
        console.log("token part is : " + token)

        res.cookie("jwt",token,{ 
            expires:new Date(Date.now()+100000),
            httpOnly:true,
            secure:true
        })
// you can write this one also - if(useremail.password===password){}

        if(isMatch){
            res.status(201).render("index")
        }else{
            // res.send("Invalid Password ")
            res.render("error")
        }
    }catch(err){
        res.render("error")
        // res.status(400).send("Invalid email details")
    }
})

// const bcrypt = require('bcryptjs')

// const securePassword = async(password)=>{
//     const passwordhash= await bcrypt.hash(password,10)
//     console.log(passwordhash)

//     const passwordmatch= await bcrypt.compare(password,passwordhash)
//     console.log(passwordmatch)
// }

// securePassword("soummya")


// const createtoken = async()=>{
//     const token = await jwt.sign({_id:"615a7f64171e2e40d008c293"},"mynameissoummyabiswasfromsubhasgram")
//     console.log(token)

//     const userVer = await jwt.verify(token,"mynameissoummyabiswasfromsubhasgram")
//     console.log(userVer)
// }

// createtoken()



app.listen(port,()=>{
    console.log("Connection is sucessful")
})