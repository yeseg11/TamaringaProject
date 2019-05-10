const  mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

//Create a schema of playlist
const playlistSchema = mongoose.Schema({
    name:String,
    similarity: [],
    year:Number,
    country:String,
    records: [{
        mbid: String,
        title: String,
        year: Number,
        artist: [],
        country: String,
        youtube: {},
        votes: [{userId: String, vote: Number}]
    }]
});

//validate the unique option, before it saves it to database it will check for unique id
//and we will get an error if we try to save a user with an id does already exist
//playlistSchema.plugin(uniqueValidator);

// make the schema available to the playlist in our Node applications
module.exports = mongoose.model("PlayList" , playlistSchema);
