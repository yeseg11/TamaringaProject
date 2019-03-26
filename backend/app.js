const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt"); //move later to routes/users
const User = require("./models/users");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect("mongodb+srv://david:RrOvOoe4ZFDiVpYf@cluster0-bo1pz.mongodb.net/test?retryWrites=true", { useNewUrlParser: true })
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

app.post("/api/user/signup", (req, res, next) => {
  const user = req.body;
  console.log("in app.post --- server");
  console.log(user);
  res.status(201).json({
    message: 'Post added successfully -- returned from server'
  });
});

module.exports = app;


// app.get("api/user/signup", (req, res, next) => {
//   const posts = [
//     {
//       id: "Miriam",
//       title: "First server-side post",
//       content: "This is coming from the server"
//     },
//     {
//       id: "Allalouf",
//       title: "Second server-side post",
//       content: "This is coming from the server!"
//     }
//   ];
//   res.status(200).json({
//     message: "Posts fetched successfully!",
//     posts: posts
//   });
// });


// app.post("api/user/signup", (req, res, next) =>
//   const user = req.body;
//   console.log("in app.post --- server");
//   console.log(req);
//   bcrypt.hash(req.body.password, 10)
//     .then(hash => {
//       const user = new User({
//         id: req.body.id,
//         password: hash
//       });
//       user.save()
//         .then(result => {
//           res.status(201).json({
//             message: 'User created!',
//             result: result
//           });
//         })
//         .catch(err => {
//           res.status(500).json({
//             error: err
//           });
//         });
//     })});

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, DELETE, OPTIONS"
//   );
//   next();
// });
