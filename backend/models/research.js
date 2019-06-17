const  mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

//Create a schema of user
const researchSchema = mongoose.Schema({
  name: { type: String },
  participants: { type: [String] },
  id: { type: Number },
  process: { type: String },
  variables: { type: String },
  startDate: { type: String },
  endDate: { type: String }
});

//validate the unique option, before it saves it to database it will check for unique id
//and we will get an error if we try to save a user with an id does already exist
//userSchema.plugin(uniqueValidator);

// make the schema available to the users in our Node applications
module.exports = mongoose.model("Research" , researchSchema);
