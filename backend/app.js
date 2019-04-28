const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// const bcrypt = require("bcrypt"); //move later to routes/users
const User = require("./models/users");
const jwt = require('jsonwebtoken');
const checkAuth = require("./middleware/check-auth"); //just pass the refernce to that funtion (and not execute) and Express will execute for us

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect("mongodb+srv://david:RrOvOoe4ZFDiVpYf@cluster0-bo1pz.mongodb.net/Tamaringa", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database!");
})
  .catch(() => {
    console.log("Connection to database failed");
  });
mongoose.set('useCreateIndex', true);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});


// app.use((req, res, next) => {
//   console.log('first middleware');
// });
//
// app.use((req, res, next) => {
//   res.send('hello from express!');
// });



//move later to routes/users
//User is our User object of the users model
//passing a javascript object to it to configure it and there
// set an id property because my user model has an id property

// app.post("/api/user/signup", (req, res, next) => {
//   const user = req.body;
//   console.log("in app.post --- server");
//   console.log(user);
//   res.status(201).json({
//     message: 'Post added successfully -- returned from server'
//   });
// });

//save user to the DB
app.post("/api/user/signup", (req, res, next) => {
  //once the hash func is done, we get the hash param and then inside the then block we create a new user
  // bcrypt.hash(req.body.password, 10)
  //   .then(hash => {
      const user = new User({
       // fullName: req.body.fullName,
        id: req.body.id,
        //age: req.body.age,
        //country: req.body.country,
        password: req.body.password,
      });
      user.save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: 'User created!',
            result: result //we send the result data so we can see what's inside there
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
    // });
});



app.post("/api/user/login", (req, res, next) => {
  User.findOne({ id: req.body.id })
    .then(user => {
    console.log(user);
    if(!user) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    //return bycrypt.compare(req.body.password, user.password);

    //creates a new token based on some input data of your choice - in our case we'll use the id and the _id that MongoDB provides for us
    const token = jwt.sign(
        {id: user.id, userId: user._id},
        'secret_this_should_be_longer',
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
      //console.log(res);
  });
});



module.exports = app;
