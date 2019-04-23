const  mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  fullName: { type: String, required: true},
  id: { type: String, required: false},
  password: { type: String, required: false},
  country: { type: String, required: false}
  });

//validate the unique option, before it saves it to database it will check for unique id
//and we will get an error if we try to save a user with an id does already exist
//userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User" , userSchema);
