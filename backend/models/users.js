const  mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

//Create a schema of user
const userSchema = mongoose.Schema({
  fullName: { type: String, required: false},
  id: { type: Number, required: true},
  age: { type: Number, required: false},
  password: { type: String, required: true},
  country: { type: String, required: false}
  });

//validate the unique option, before it saves it to database it will check for unique id
//and we will get an error if we try to save a user with an id does already exist
//userSchema.plugin(uniqueValidator);

// make the schema available to the users in our Node applications
module.exports = mongoose.model("User" , userSchema);
