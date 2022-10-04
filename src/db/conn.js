const mongoose = require('mongoose')
const validator = require ('validator')
/*connection  to mongodb localhost */
mongoose.connect("mongodb://localhost:27017/myTeam").then(()=>{
    console.log("connection is successfully ....")
}).catch((err)=>{
    console.log("No connection ....")
});