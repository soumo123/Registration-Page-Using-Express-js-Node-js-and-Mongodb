const mongoose = require('mongoose')
 const validator = require('validator')

mongoose.connect("mongodb://localhost:27017/studentregistration",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=> console.log('Connection Successful'))
.catch((err)=> console.log(err))
