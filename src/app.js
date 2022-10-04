require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser")
const Register = require("./models/registers");
const auth = require("./middleware/auth")
require("./db/conn");

/*create port */
const port = process.env.PORT || 3000;

/*express json */
app.use(express.json());

/*form ke data ko lene ke liye */
app.use(express.urlencoded({ extended: false }));

/* add public folder  */
const staticPath = path.join(__dirname, "../public");
app.use(express.static(staticPath));
app.use(cookieParser());

// app.use(express.json());
//  app.use(router);

/*add views and partials  folder */
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
app.set("views", templatePath);
hbs.registerPartials(partialsPath);


// console.log(process.env.SECRET_KEY);



/*add views folder of hbs */
app.set("view engine", "hbs");

app.get("/secret",auth, (req, res) => {
  /*get cookie by cookie-parser */
// console.log(`this is the cookie ${req.cookies.jwt}`)

  res.render("secret");
});







/*logout form devices */
app.get("/logout",auth, async(req, res) => {
 
 try{



  /*logout from one devices */
  //  req.user.tokens = req.user.tokens.filter((currElement)=>{
  //              return currElement.token != req.token
  //  })


  /*logout from all devices */
    req.user.tokens = [];


  // console.log(req.user)
  // console.log(req.token)
  res.clearCookie("jwt")
// console.log("logout")
await req.user.save();
res.render("login")
 }catch(error)
 {
  res.status(500).send(error)
 }

});








app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/resetpassword", (req, res) => {
  res.render("resetpassword");
});

/*post method  register */
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    if (password == cpassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: password,
        confirmpassword: cpassword,
      });

      //   console.log(`the success part ${registerEmployee}`)
      /*call function for generate jwt token */
      const token = await registerEmployee.generateAuthToken();
      //   console.log(`the toke part ${token}`)



      /*add token to cookies */
      // res.cookie("jwt",token,{expires:new Date(Date.now()+30000),httpOnly:true})
      res.cookie("jwt",token)
      





      const user = await registerEmployee.save();
      res.status(200).render("login");
    } else {
      res.send("password not matching");
    }
  } catch {
    (err) => {
      res.status(400).send(err);
    };
  }
});

/*post method  login */
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await Register.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, useremail.password);
    // console.log(isMatch);



    const token = await useremail.generateAuthToken();
      console.log(`the toke part ${token}`)


      
/*add token to cookies */
      // res.cookie("jwt",token,{
        // expires:new Date(Date.now()+60000),httpOnly:true})
      res.cookie("jwt",token)





    if (isMatch) {
      res.status(201).render("Home");
    } else {
      res.send("password are not match");
    }
  } catch {
    res.status(400).send("invalid email");
  }
});

// app.post("/resetpassword",async(req,res)=>{
//    try{
// const email = req.body.email;
//   const useremail =  await Register.findOne({email:email})
//   res.status(201).render("login")

//    }catch{
//       res.status(400).send("invalid email");
//    }
// })

/*get metnod */
app.get("/", (req, res) => {
  res.send("hello guys");
});

/*bcrypt method */
// const bcrypt = require('bcryptjs')
// const securePassword = async(password)=>{
//    const passwordHash = await bcrypt.hash(password,10);
//    console.log(passwordHash)
//    const comparePassword = await bcrypt.compare(password,passwordHash)
//    console.log(comparePassword)
// }
// securePassword("Bhopal@8796")

/*jwt authentication */
// const jwt = require('jsonwebtoken')
// const createToken = async ()=>
// {
//    const token  = await jwt.sign({_id:"1234544232323"},"mynameisajaysinghbhatisoftwareenginnerininformationtechnology",{
//       expiresIn:"2 days"
//    })
//    console.log(token)
//    const veryfy = await jwt.verify(token,"mynameisajaysinghbhatisoftwareenginnerininformationtechnology")
//    console.log(veryfy)

// }
// createToken();

/*listen app */
app.listen(port, () => {
  console.log(`listening on ${port} ......`);
});
