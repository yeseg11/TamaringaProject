const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// const bcrypt = require("bcrypt"); //move later to routes/users
const User = require("./models/users");
const Record = require("./models/records");
const jwt = require('jsonwebtoken');
const checkAuth = require("./middleware/check-auth"); //just pass the refernce to that funtion (and not execute) and Express will execute for us
const Research = require("./models/research");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect("mongodb+srv://david:RrOvOoe4ZFDiVpYf@cluster0-bo1pz.mongodb.net/Tamaringa", {useNewUrlParser: true})
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
        fullName: req.body.fullName,
        id: req.body.id,
        age: req.body.age,
        year: req.body.year,
        country: req.body.country,
        password: req.body.password,
        group: req.body.country + req.body.year,
        entrances: 0
    });
    // let fetchedRecord;
    // Record.findOne({year: 1990})
    //     .then(record => {
    //         console.log(record);
    //         if (!record) {
    //             return res.status(401).json({
    //                 message: "Find record failed"
    //             });
    //         }
    //         fetchedRecord = record;
    //         return fetchedRecord;
    //     });
    user.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'User created!',
                user: result //we send the result data so we can see what's inside there
                // record: fetchedRecord
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Invalid authentication credentials!"
            });
        });
    // });
});
// ======================test login==========================

app.post("/api/user/login", async(req, res) => {
    const user = await User.findOne({id: req.body.id});
    console.log(user);
    if (!user) {
        return res.status(401).json({
            message: "User is not found!"
        });
    }
    if (user.password != req.body.password ) {
        return res.status(401).json({
            message: "Invalid authentication credentials!"
        });
    }


    const records = await Record.find({year: {$gt: user.year - 3, $lt: user.year + 3}}).limit(20);
    // console.log(records);
    if (!records) {
        return res.status(401).json({
            message: "Find record failed"
        });
    }

    const token = jwt.sign(
        {id: user.id, userId: user._id},
        'secret_this_should_be_longer',
        {expiresIn: "1h"}
    );

    res.status(200).json({
        token: token,
        expiresIn: 3600,
        records: records,
        userID: user._id
    });
});

// ==========================================================
// app.post("/api/user/login", (req, res, next) => {
//     //console.log(user);
//     User.findOne({id: req.body.id})
//         .then(user => {
//             console.log(user);
//             if (!user) {
//                 return res.status(401).json({
//                     message: "Auth failed"
//                 });
//             }
//             //return bycrypt.compare(req.body.password, user.password);
//
//             //creates a new token based on some input data of your choice - in our case we'll use the id and the _id that MongoDB provides for us
//             const token = jwt.sign(
//                 {id: user.id, userId: user._id},
//                 'secret_this_should_be_longer',
//                 {expiresIn: "1h"}
//             );
//             res.status(200).json({
//                 token: token,
//                 expiresIn: 3600
//             });
//             //console.log(res);
//         });
// });

/** -------------------------------------------------------------------------
 * Add a new research to the database
 * @PARAM {String*} id: Given research id
 * @PARAM {String*} name: Given research name
 * @PARAM {String*} process: Given research process
 * @PARAM {String*} variables: Given research variables
 * @PARAM {Date*} startDate: Given research startDate
 * @PARAM {Date*} endDate: Given research endDate
 */
app.post("/api/researcher/new-research", (req, res, next) => {
  console.log("id1: ", req.body.id);
  const research = new Research({
    name: req.body.name,
    id: req.body.id,
    // participants: req.body.participants,
    process: req.body.process,
    variables: req.body.variables,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });
  research.save()
    .then(result => {
      console.log(result);
      console.log("id2: ", req.body.id);
      res.status(201).json({
        message: 'Research created!',
        result: result //we send the result data so we can see what's inside there
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Creating a research failed!'
      });
    });
  // });
});

/** -------------------------------------------------------------------------
 * Return an object of all the researches
 *  @PARAM {Object*} researches: researches array
 */
app.get("/api/researcher/new-research", (req, res, next) => {
  Research.find().then(documents => {
    console.log(documents);
    console.log('type:' + typeof(documents));
      res.status(200).json({
        message: "Researches fetched successfully",
        researches: documents
      });
    });

});

/** -------------------------------------------------------------------------
 * Delete a specific research by ID
 *  @PARAM {String*} _id: Given research id
 */
app.delete("/api/researcher/new-research/:id", (req, res, next) => {
  Research.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({ message: "Research deleted"});
  })
});

module.exports = app;

