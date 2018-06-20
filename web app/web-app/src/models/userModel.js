var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Hash = require('password-hash'),
    passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt');
var autoIncrement = require('mongoose-auto-increment');

var Text= require('./textModel');

var connection = mongoose.createConnection('mongodb://localhost:27017/webAp');

autoIncrement.initialize(connection);


var userModel =  new Schema ({
    _id :  {type: Number},
    firstName: {type: String},
    lastName: {type: String},
    username: {type: String,unique: true},
    password: {type: String},
    texts: {type: Array}
});

//hashing a password before saving it to the database
userModel.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

userModel.plugin(autoIncrement.plugin, 'User');
userModel.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',userModel);