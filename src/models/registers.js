const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//create schema
const registerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

/*   middle ware      to generate jwt token make function */
registerSchema.methods.generateAuthToken = async function () {
  try {
    // console.log(this._id)
    const token = jwt.sign(
      { id: this._id.toString() },
      process.env.SECRET_KEY
    );

    /*tokens ko add krna database me */
    this.tokens = this.tokens.concat({ token: token });
    /*token ko add krne ke liye save() */
    await this.save();

    return token;
  } catch (error) {
    res.send("the error part" + error);
    //   console.log("the error part "+error)
  }
};

/*middle ware   password hash  */
registerSchema.pre("save", async function (next) {
  /*keval password modified hone per use hash me change krna hai  */
  if (this.isModified("password")) {
    // console.log(this.password)
    this.password = await bcrypt.hash(this.password, 10);
    // console.log(this.password)
    this.confirmpassword = await bcrypt.hash(this.password, 10);
  }
  next();
});

/*create model */
const Register = new mongoose.model("Register", registerSchema);

//exports
module.exports = Register;
