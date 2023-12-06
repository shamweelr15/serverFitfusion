const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const conn = require("../db/conn");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
  
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
const nutritionSchema = new mongoose.Schema({
 
    user: {
      type: String,
      
      required: true,
    },
  foodName: {
    type: String,
    required: true,
  },
  portionSize: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema);


const userActivitySchema = new mongoose.Schema({
  

    user: {
      type: String,
      required: true,
    },
  activityName: {
    type: String,
    required: true,
  },
  timing: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }

});

const userActivity = mongoose.model('userActivity', userActivitySchema );

const bmiSchema = new mongoose.Schema({

  user: {
    type: String,
    required: true,
  },
      gender: {
        type: String,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      bmi: {
        type: Number,
        required: true,
      }
});

const userBmi = mongoose.model('userBmi', bmiSchema );



// Hashing the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    var algorithm = "aes256"; // or any other algorithm supported by OpenSSL
    var key = "FTSCS";
    var text = this.password;
    var cipher = crypto.createCipher(algorithm, key);
    var encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
    this.password = encrypted;
    this.cpassword = encrypted;
  }
  next();
});
//generating auth token
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    console.log(token);
    return token;
  } catch (err) {
    console.log(err);
  }
};


//store the message

userSchema.methods.addMessage = async function (name, email, phone, message) {
  try {
    this.messages = this.messages.concat({ name, email, phone, message });
    await this.save();
    return this.messages;
  } catch (error) {
    console.log("error ");
  }
};
userSchema.methods.addCalorie = async function (calin) {
  try {
    // Assuming calin is a valid value

    // Add the new calorie to the existing calin field
    this.calin += calin;

    // Save the updated user document
    await this.save();

    // Return the updated calin value
    return this.calin;
  } catch (error) {
    console.error("Error adding calorie:", error);
    throw error; // Throw the error so that it can be caught and handled elsewhere
  }
};


nutritionSchema.methods.addNutrition = async function ( Jsondata) {
  try {
    this.nutritionValue = this.nutritionValue.concat({Jsondata});
    await this.save();
    return this.nutritionValue;
  } catch (error) {
    console.log("error ");
  }
};

const User = mongoose.model("USER", userSchema);
const Food = conn.mongoose.model("FOOD", foodSchema);
const Activity = conn.mongoose.model("ACTIVITY", activitySchema);

module.exports = { User, Food, Activity,Nutrition,userActivity, userBmi};
