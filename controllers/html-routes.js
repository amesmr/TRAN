// starting point, will replace User, Player, and whatever else is needed.
// some of this may not be needed, until we can go through it and take that
// out, I left everything in.

var path = require("path");
var db = require("../models");
var moment = require("moment");

var session;

// Routes
// =============================================================
module.exports = function(app) {

    app.get("/", function(req, res) {

        res.sendFile(__dirname + "/public/index.html");
        // db.User.findAll({
        //         where: {
        //             role: "user"
        //         },
        //         include: [{
        //             model: db.Player,
        //             include: [{
        //                 model: db.Tournament,
        //             }],
        //             where: {
        //                 player_checkedIn_flag: 1
        //             }
        //         }]
        //     })
        //     .then(function(results) { //all users that exist that played in any tournament
        //         // console.log("Here are the results you wanted: " + JSON.stringify(results, null, 2));
        //         // Array to convert to response object
        //         var responseArray = [];
        //         // console.log(results);
        //         results.forEach(function(resultItem) { //for each user
        //             // console.log("Here are the results you wanted: " + JSON.stringify(resultItem, null, 2));

        //             console.log("-------");

        //             var playerData = resultItem.dataValues.Players;
        //             var points = 0;
        //             var tournamentsDataArray = [];
        //             var username = resultItem.dataValues.username;

        //             playerData.forEach(function(playerItem) { //for each time this user has ever been a player in a touranment (also attaches tournament data)

        //                 points = points + playerItem.dataValues.points;
        //                 var tournamentName = playerItem.dataValues.Tournament.dataValues.name;
        //                 var tournamentDate = playerItem.dataValues.Tournament.dataValues.date;
        //                 var tournamentTime = playerItem.dataValues.Tournament.dataValues.time;
        //                 // tournamentDatesArray.push(tournamentDate);
        //                 var tournamentDataObject = {
        //                     "name": tournamentName,
        //                     "date": tournamentDate,
        //                     "time": tournamentTime
        //                 };

        //                 console.log(tournamentDataObject);
        //                 // Pushing each tournament object to array to get latest based on date
        //                 tournamentsDataArray.push(tournamentDataObject);
        //                 // console.log(playerItem.dataValues.Tournament.dataValues.date);
        //             });


        //             // If more than one tournament was played
        //             var latestTournamentData = tournamentsDataArray.sort(function(a, b) {
        //                 return (a.date < b.date);
        //             })[0];

        //             console.log(latestTournamentData);

        //             var JSONdataToSend = {
        //                 "username": username,
        //                 "points": points,
        //                 // "tournamentName": latestTournamentData.name,
        //                 "tournamentDate": latestTournamentData.date,
        //                 "tournamentTime": latestTournamentData.time
        //                     // "tournamentTime": latestTournamentData.time
        //             };



        //             console.log(JSONdataToSend);
        //             responseArray.push(JSONdataToSend);
        //             // Sorting to display users based on descending order of points (done here to get proper index in handlebars as rank)
        //             responseArray.sort(function(a, b) {
        //                 return (a.points < b.points);
        //             });

        //         });

        //         console.log(responseArray);

        //         db.Tournament.findAll({
        //             where: {
        //                 active_flag: 1
        //             }
        //         }).then(function(tournamentData) {
        //             // tournamentData.forEach(function(tournament) {
        //             //   if(moment().diff(tournament.dataValues.date) > 0) {
        //             //     console.log(tournament.dataValues.date);
        //             //   }
        //             // });
        //             res.render("index", {
        //                 tournament: tournamentData,
        //                 responseData: responseArray,
        //                 helpers: handlebarHelpers,
        //                 newUser: req.session.newRegister
        //             });
        //         });
        //     })
        //     .catch(function(error) {
        //         console.log(error);
        //     });

    });


    // // Render tournament data on admin page
    // app.get("/admin", function(req, res) {
    //     session = req.session;
    //     if (session.uniqueID[1] === 'admin') {
    //         db.Tournament.findAll({
    //             where: {
    //                 active_flag: 1
    //             }
    //         }).then(function(tournamentResults) {
    //             res.render("admin", {
    //                 tournament: tournamentResults,
    //                 userName: req.session.uniqueID[3],
    //                 helpers: handlebarHelpers
    //             });

    //         });
    //     } else {
    //         console.log('unauthorized access');
    //         res.redirect('/');
    //     }
    // });

    // // Render tournament specific to user and other tournaments
    // app.get("/user/:id", function(req, res) {
    //     console.log("------");
    //     console.log(req.session.uniqueID);
    //     console.log("------");
    //     var userId = req.params.id;
    //     console.log(typeof req.session.uniqueID[2]);
    //     console.log(typeof userId);


    //     if (req.session.uniqueID[2] === parseInt(userId)) {
    //         // Get tournaments and players table data
    //         db.Tournament.findAll({
    //             include: [{
    //                 model: db.Player
    //             }],
    //             where: {
    //                 active_flag: 1
    //             }
    //         }).then(function(tournamentResults) {
    //             // With tournamentsResults, map it to required json data format
    //             var userTournamentData = tournamentResults.map(function(tournamentItem) {
    //                 var ofUser = false;
    //                 var playerData = tournamentItem.dataValues.Players;
    //                 playerData.forEach(function(playerItem) {
    //                     // For current user
    //                     if (playerItem.dataValues.UserId == userId) {
    //                         // Check if this tournament was registered for
    //                         if (playerItem.dataValues.player_registered_flag == 1) {
    //                             // If yes, set flag to true
    //                             ofUser = true;
    //                             // else flag will be false
    //                         }

    //                     }
    //                 });
    //                 // Return required data
    //                 return {
    //                     "userId": userId,
    //                     "id": tournamentItem.id,
    //                     "name": tournamentItem.name,
    //                     "date": tournamentItem.date,
    //                     "time": tournamentItem.time,
    //                     "ofUser": ofUser
    //                 };

    //             });
    //             // console.log(userTournamentData);

    //             res.render('user', {
    //                 userName: req.session.uniqueID[3],
    //                 tournament: userTournamentData,
    //                 helpers: handlebarHelpers
    //             });
    //         });
    //     } else {
    //         res.render("401");
    //     }


    // });


    // app.get("/register", function(req, res) {
    //     //Todo//
    //     res.render('register', { title: 'Form Validation', success: req.session.success, errors: req.session.errors });
    //     //this resets the errors and success properties to null after they have been shown to user
    //     req.session.errors = null;
    //     req.session.success = null;

    // });

    // // Checkin page players display
    // app.get("/checkin/:id", function(req, res) {
    //     var tournamentPlayers = [];
    //     var tournament_Id = req.params.id;
    //     // SELECT users.username FROM Users INNER JOIN Players ON users.id = players.UserId WHERE players.TournamentId = 1 AND players.player_registered_flag = 1;
    //     db.User.findAll({
    //         include: [{
    //             model: db.Player,
    //             where: {
    //                 TournamentId: tournament_Id,
    //                 player_registered_flag: 1,
    //             }
    //         }]
    //     }).then(function(playerNames) {
    //         // playerNames does not consist of just User.username and User.id hence array mapping
    //         tournamentPlayers = playerNames.map(function(item) {
    //             return {
    //                 "username": item.dataValues.username,
    //                 "userId": item.dataValues.id,
    //                 "player_checkedIn_flag": item.dataValues.Players[0].dataValues.player_checkedIn_flag
    //             };
    //         });
    //         // console.log(tournamentPlayers);
    //         // Render checkin page with names of registered users
    //         res.render('checkin', {
    //             player: tournamentPlayers,
    //             tournamentId: tournament_Id,
    //             // express handlebars helper function inc to increment index by 1 for serial number display
    //             helpers: {
    //                 inc: function(index) { return parseInt(index) + 1; }
    //             }
    //         });
    //     }).catch(function(err) {
    //         // handle error;
    //         console.log("Error: " + err);
    //         ///////////////// To do //////////////////
    //         // res.redirect("/500");
    //         res.render("500", { error: err });
    //     });
    // });


    // app.get('/logout', function(req, res) {
    //     console.log('get logout');
    //     req.session.destroy(function(error) {
    //         console.log(error);
    //         res.redirect('/');
    //     });
    // });

    // app.use(function(err, req, res, next) {
    //     console.log(err.stack);
    //     res.status(401);
    //     res.render('401');
    // });

    // app.use(function(err, req, res, next) {
    //     console.log(err.stack);
    //     res.status(500);
    //     res.render('500');
    // });

};