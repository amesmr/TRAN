// this is from previous project, we will use this as a starting point since
// hash/encryption for passwords is already done, we just have to change where
// it shows Tournament and such.

var path = require("path");
var db = require("../models");
var sessions = require("express-session");
var crypto = require('crypto');

var session;

//hash functions
const sha512 = (password, salt) => {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

const genRandomString = (length) => {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

// Routes =============================================================
module.exports = function (app) {
    //REGISTER NEW USER
    app
        .post("/users/register", function (req, res, next) {
            //Validation - checks if form is filled out properly
            req.checkBody('email', 'Email is required').notEmpty();
            req.checkBody('email', 'Email is not valid').isEmail();
            req.checkBody('adminName', 'Username is required').notEmpty();
            req.checkBody('pswd1', 'Password is required').notEmpty();
            req.checkBody('pswd2', 'Passwords do not match').equals(req.body.pswd1);

            var errors = req.validationErrors();

            if (errors) { //if errors, restart register page
                req.session.errors = errors;
                req.session.success = false;
                res.render('register', {
                    errors: errors
                });
            } else {
                //else look if there is a current user with same username or same email address
                db.Admin.findAll({
                        where: {
                            $or: [{
                                admin_name: req.body.adminName
                            }, {
                                email: req.body.email
                            }, {
                                google_place_id: req.body.googlePlaceID
                            }, {
                                non_profit_id: req.body.nonProfitID
                            }]
                        }
                    })
                    .then(function (adminResults) {
                        if (adminResults.length) { //if there is a match of same name, restart register page
                            res.render('register', {
                                errors: [{
                                    msg: "Username or e-mail already in use"
                                }]
                            });
                        } else { //else hash password and create the user
                            req.session.success = true;
                            var salt = genRandomString(32);
                            var hashedPassword = sha512(req.body.password, salt).passwordHash;
                            db.Admin.create({
                                    admin_name: req.body.adminName,
                                    email: req.body.email,
                                    address: req.body.address,
                                    google_place_id: req.body.googlePlaceID,
                                    non_profit_id: req.body.nonProfitID,
                                    role: role,
                                    hash: hashedPassword,
                                    salt: salt
                                })
                                .then(function (result) {
                                    // redirect to user.html with username in welcome message
                                    req.session.newRegister = true;
                                    res.redirect('adminMaps');
                                });
                        }

                    });
            }
        });

    // //SESSION LOGIN app.post("/login", function(req, res) {     var session =
    // req.session;     var email = req.body.email;     var password =
    // req.body.password;     console.log("am here");     session.newRegister =
    // false;     //checks hash against hash for entry validation db.User.findOne({
    //      where: {             email: email         } }).then(function(data) {
    // var salt = data.salt;         var hashedPassword = sha512(req.body.password,
    // salt).passwordHash;         if (hashedPassword === data.hash) {
    // session.loggedIn = true;     session.uniqueID = [data.email, data.role,
    // data.id, data.username];       if (data.role === "admin") {
    // res.send({ redirect: '/admin' });             } else if (data.role ===
    // "user") { res.send({ redirect: '/user/' + data.id });           } else {
    // console.log('No role found');             }         } else {
    // console.log("Illegal entry detected."); res.status(400).send(); }
    // }).catch(function(err) { console.log("The error is" + err);
    // res.status(400).send();     }); }); //REGISTER FOR TOURNAMENT
    // app.put('/register/tournament', function(req, res) {     var tournamentID =
    // req.body.tournamentId;     var userID = req.session.uniqueID[2];
    // console.log("Inside api-routing /register/tournament function");     if
    // (userID == req.body.userId) {         console.log("User Id = reqbodyuserId;
    // Data querying now.");         db.Player.findAll({  attributes:
    // ['player_registered_flag', 'updatedAt', 'createdAt'],  where: { UserId:
    // userID,                 TournamentId: tournamentID       },   limit: 1,
    //       order: [ ['updatedAt', 'DESC']             ]
    // }).then(function(registeredData) {             console.log(registeredData);
    //         if (registeredData.length === 0) { db.Player.create({ UserId: userID,
    //                     TournamentId: tournamentID,  player_registered_flag: 1
    // }).then(function(data) { console.log(data);   });             } else {
    //          var updatedAt = registeredData[0].dataValues.updatedAt;
    //    db.Player.update({            player_registered_flag: 1                 },
    // {       where: {                  UserId: userID,  TournamentId:
    // tournamentID, updatedAt: updatedAt                 } }).then(function(data) {
    // console.log(data);                 }); }             //
    // res.redirect("/user/"+userID);             res.json("Player registration
    // updated.");         });     } }); //UNREGISTER FOR TOURNAMENT
    // app.put('/unregister/tournament', function(req, res) {
    // console.log("unregister");     var tournamentID = req.body.tournamentId; var
    // userID = req.session.uniqueID[2];     if (userID == req.body.userId) {
    // db.Player.update({             player_registered_flag: 0         }, {  where:
    // {                 UserId: userID, TournamentId: tournamentID    }
    // }).then(function(data) {         res.json("Unregistered for tournament.");
    //   });     } }); // PUT route to update checkedIn players in table
    // app.put("/player/checkin", function(req, res) { db.Player.update({
    // player_checkedIn_flag: 1    }, {         where: {            UserId:
    // req.body.UserId, TournamentId: req.body.TournamentId   }
    // }).then(function(data) {      res.json("flag updated on checkin");  }); });
    // // PUT route to uncheck players if need be /player/undocheckin
    // app.put("/player/undocheckin", function(req, res) {     db.Player.update({
    // player_checkedIn_flag: 0    }, {         where: {             UserId:
    // req.body.UserId, TournamentId: req.body.TournamentId         }
    // }).then(function(data) {      res.json("flag updated on checkin");     });
    // }); // PUT route to update player points app.post("/player/results",
    // function(req, res) {     // console.log(req.body.resultsDataArray);     var
    // resultsArray = req.body.resultsDataArray;     var updatesPromiseArray = [];
    // console.log(req.body.resultsDataArray.TournamentId);     // Looping through
    // data array, and pushing the promise of each sequelize update query into an
    // array     resultsArray.forEach(function(item) {         // console.log(item);
    //         updatesPromiseArray.push(             db.Player.update({    points:
    // item.points             }, {                 where: {        UserId:
    // item.UserId,                     TournamentId: item.TournamentId    }     })
    //        ); //end of promise array     }); updatesPromiseArray.push(
    // db.Tournament.update({             active_flag: 0       }, { where: {
    // id: req.body.resultsDataArray[0].TournamentId      }         }) );     //
    // Waiting for all db updates to complete before deciding success/failure and
    // returning control to client browser
    // Promise.all(updatesPromiseArray).then(function(data) {         // On success
    //     console.log("success" + data);         res.json({ redirectURL: "/admin",
    //            status: "success"         });         // On failure },
    // function(err) {         console.log("Something failed.");
    // res.status(500).send(err);     }); }); //PUT route to update tournament info
    // app.put("/update/tournament", function(req, res) { db.Tournament.update({
    // name: req.body.TournamentName,         date: req.body.TournamentDate, time:
    // req.body.TournamentTime     }, {   where: {             id:
    // req.body.TournamentId         } }).then(function(data) { console.log(data);
    // res.send("updated");     }); //.catch(function(error) {  //
    // console.log(error);     //     // res.json("Error " + error);     //
    // res.render("500", {error: error});     // }); }); //PUT route to delete
    // tournament info app.put("/delete/tournament", function(req, res) {
    // db.Tournament.update({         active_flag: 0     }, {         where: { id:
    // req.body.TournamentId         }     }).then(function(data) {
    // console.log(data);         res.send("deleted tournament - updated
    // active_flag");     }); //.catch(function(error) {     // console.log(error);
    //  //     // res.json("Error " + error);     // res.render("500", {error:
    // error});     // }); }); // Get request to get session data
    // app.get("/loggedIn", function(req, res) { res.json(req.session); });
};