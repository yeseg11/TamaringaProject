const  mongoose = require('mongoose');

//Create a schema of record
const recordsSchema = mongoose.Schema({
  mbId: { type: String},
  title: { type: String},
  year: { type: Number},
  artist: [{name: String, language: String}],
  country: {type: String},
  mbRaw: {},
  youtube: {}
});

//validate the unique option, before it saves it to database it will check for unique id
//and we will get an error if we try to save a user with an id does already exist
//userSchema.plugin(uniqueValidator);

// make the schema available to the users in our Node applications
module.exports = mongoose.model("Records" , recordsSchema);
