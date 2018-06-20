var User = require('../models/userModel');
var passport = require('passport');
var PassportLocalStrategy = require('passport-local');

var authStrategy = new PassportLocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function(username, password, done) {
    User.authenticate(username, password, function(error, user){
        // You can write any kind of message you'd like.
        // The message will be displayed on the next page the user visits.
        // We're currently not displaying any success message for logging in.
        done(error, user, error ? { message: error.message } : null);
    });
});

var authSerializer = function(user, done) {
    done(null, user.id);
};

var authDeserializer = function(id, done) {
    User.findById(id, function(error, user) {
        done(error, user);
    });
};

passport.use(authStrategy);
passport.serializeUser(authSerializer);
passport.deserializeUser(authDeserializer);

