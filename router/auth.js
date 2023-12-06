const express = require("express");
const crypto = require('crypto');
const router = express.Router();
require("../db/conn");

const jwt = require("jsonwebtoken");

const authenticate = require("../middleware/authenticate");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.get("/", (req, res) => {
  res.send("Home Page router,js");
});

const bcrypt = require("bcryptjs");
const { User, Food, Activity,Nutrition,userActivity, userBmi} = require('../model/userSchema');

router.post("/register", async (req, res) => {
  
  const {
    name,
    email,
    phone,
    password,
    cpassword,
  } = req.body;
  if (
    !name ||
    !email ||
    !phone ||
    !password ||
    !cpassword
  ) {
    return res.status(403).json({ error: "Please enter all the fields" });
  }
  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Account already exists" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Password does not match" });
    } else {

      const user = new User({
        name,
        email,
        phone,
        password,
        cpassword,
      });

      const userRegister = await user.save();
      if (userRegister) {
        res.status(201).json({ message: "Registration Successfull!" });
      } else {
        res.status(500).json({ message: "Failed to register" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/signin", async (req, res) => {
  try {


    let token;
    const { email, password } = req.body;
    //console.log('email--'  , email);
    //console.log('password--'  , password);
    
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter all the credentials" });
    }

    var algorithm = 'aes256'; 
    var key = 'FTSCS';
    var text = password;
    var cipher = crypto.createCipher(algorithm, key);  
    var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
    

    const cpassword = encrypted;

    //console.log('cpassword--'  , cpassword);

    const userLoginall =  await User.find({});

    const userLogin = await User.find({ email: email , password:cpassword}).exec();
    //console.log("Login-Data" ,userLogin ) ;
    //console.log("Login-Data-Length " ,userLogin.length ) ;
    const loginount = userLogin.length ;

    if (loginount >0) {
      req.session.user = userLogin;      
      res.json({ message: "User Logged in Succefully" });
      
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
   
  } catch (err) {
    console.log(err);
  }
});

router.get('/check-login', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

router.post('/bmi', async (req, res) => {
  try {
    const Jsondata = req.body;
    const count = 0;
    userBmi.insertMany(Jsondata)
    .then(function () {
      res.json({ success: true, message: 'BMI saved successfully', data: savedNutrition });
    })
    .catch(function (err) {
      res.json({ success: false, message: err, data: count });
    });  

    
  } catch (error) {
    console.error('Error saving BMI data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/getBmi', async (req, res) => {
  try {
    const lastUpdatedEntry =await userBmi.findOne(req.body).sort({ _id: -1 }).exec();
    res.json({ lastUpdatedEntry });
      } catch (error) {
    console.error('Error fetching last updated calories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

          router.get('/dashboard', authenticate ,(req,res)=>{
            console.log("Hello dashboard")
            res.send(req.rootUser);
          
        })
        //For contact us and home page
          router.get('/getData', authenticate ,(req,res)=>{
            console.log("Hello data")

            res.send(req.rootUser);
          
        })
          router.post('/contact', async(req,res)=>{
            try{
                const {name,email,phone,message}=req.body;
                if(!name||!email||!phone||!message){
                  console.log("Please fill the contact form");
                 return res.json({error:"Please fill the contact form"});
                 
                }

                const userContact =await food.User.findOne({_id: req.session._id});
              
                if(userContact){
                    const userMessage =await userContact.addMessage(name,email,phone,message);
                    await userContact.save();
                    res.status(201).json({message :"User Contact successfull!"});
                }
            }catch(error){
              console.log(error);
            }
          
        });
          
    

        


//FOOD API

router.post("/fooditems",async(req,res)=>{
    try{
        const {name,calories}=req.body;
    const addfood =new Food({name,calories});
    console.log(addfood);
   const resfood= await addfood.save();
  
    res.status(201).send(resfood);
    }catch(e){
   res.status(400).send(e);
    }
})
router.get("/fooditems",async(req,res)=>{
    try{
        const {name}= req.query;
        const queryObject={};
        
        if(name){
            queryObject.name= {$regex: name , $options:"i"};
        }
       const getFoods= await Food.find(queryObject);
  
    res.send(getFoods);
    }catch(e){
   res.status(400).send(e);
    }
})
// for individual food item
router.get("/fooditems/:id",async(req,res)=>{
    try{
        const _id = req.params.id;
       const getFood= await Food.findById(_id);
    res.send(getFood);
    }catch(e){
   res.status(400).send(e);
    }
})
// for updation
router.patch("/fooditems/:id",async(req,res)=>{
    try{
        const _id = req.params.id;
       const getFood= await food.findByIdAndUpdate(_id,req.body,{new: true});
    res.send(getFood);
    }catch(e){
   res.status(500).send(e);
    }
})
//for delete request
router.delete("/fooditems/:id",async(req,res)=>{
    try{
        const _id = req.params.id;
       const getFood= await Food.findByIdAndDelete(_id);
    res.send(getFood);
    }catch(e){
   res.status(500).send(e);
    }
})

//ACTIVITY API

router.post("/activities",async(req,res)=>{
  try{
      const {name,calories}=req.body;
  const addActivity =new Activity({name,calories});
  console.log(addActivity);
 const resActivity= await addActivity.save();

  res.status(201).send(resActivity);
  }catch(e){
 res.status(400).send(e);
  }
})
router.get("/activities",async(req,res)=>{
  try{
      const {name}= req.query;
      const queryObject={};
      
      if(name){
          queryObject.name= {$regex: name , $options:"i"};
      }
     const getActivities= await Activity.find(queryObject);

  res.send(getActivities);
  }catch(e){
 res.status(400).send(e);
  }
})
// for individual
router.get("/activities/:id",async(req,res)=>{
  try{
      const _id = req.params.id;
     const getActivity= await Activity.findById(_id);
  res.send(getActivity);
  }catch(e){
 res.status(400).send(e);
  }
})
// for updation
router.patch("/activities/:id",async(req,res)=>{
  try{
      const _id = req.params.id;
     const getActivity= await Activity.findByIdAndUpdate(_id,req.body,{new: true});
  res.send(getActivity);
  }catch(e){
 res.status(500).send(e);
  }
})
//for delete request
router.delete("/activities/:id",async(req,res)=>{
  try{
      const _id = req.params.id;
     const getActivity= await Activity.findByIdAndDelete(_id);
  res.send(getActivity);
  }catch(e){
 res.status(500).send(e);
  }
})



router.get("/", async (req, res) => {
  res.send("Hello from thapa");
});
router.get("/logout", async (req, res) => {
  console.log("User logged out");
  req.session.destroy();

  // Redirect the user to the home page
  // res.redirect('/');
  // res.clearCookie('jwtoken',{path :'/'});

  res.status(200).send("User Logout");
});

// Update total daily calories
// Route for adding food items with client-calculated calories


// Fetch total daily calories

    
router.post('/saveNutritionData', async (req, res) => {
  try {
    const Jsondata  = req.body;
    const count =0 ;

    Nutrition.insertMany(Jsondata)
    .then(function () {
      res.json({ success: true, message: 'Nutrition data saved successfully', data: savedNutrition });
    })
    .catch(function (err) {
      res.json({ success: false, message: err, data: count });
    });   
      
  } catch (error) {
    console.error('Error saving nutrition data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }

  

});

router.post('/getLastUpdatedCalories', async (req, res) => {
  try {
    const lastUpdatedEntry =await Nutrition.find(req.body);
    res.json({ lastUpdatedEntry });
      } catch (error) {
    console.error('Error fetching last updated calories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/saveActivityData', async (req, res) => {
  try {
    const Jsondata = req.body;
    const count = 0;
 
   userActivity.insertMany(Jsondata)
    .then(function () {
      res.json({ success: true, message: 'Activity data saved successfully', data: savedActivity });
    })
    .catch(function (err) {
      res.json({ success: false, message: err, data: count });
    });   
      
  } catch (error) {
    console.error('Error saving Activity data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/getLastUpdatedActivities', async (req, res) => {
  try {
    const lastUpdatedEntry =await userActivity.find(req.body);
    res.json({ lastUpdatedEntry });
      } catch (error) {
    console.error('Error fetching last updated Actitivity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
