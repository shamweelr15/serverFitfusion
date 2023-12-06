const jwt = require("jsonwebtoken");
const { User } = require("../model/userSchema");
const authenticate = async (req, res, next) => {
  try {
    
    
    const token =req.session.user._id;
    console.log('Session Id' , token);
e
    if(token ==="")
        throw new Error("User not found");
    next();
  } catch (err) {
    res.status(401).send("Unauthorized : No token provided");
    console.log(err);
  }
};

module.exports = authenticate;
