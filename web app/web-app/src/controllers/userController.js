var mongoose = require('mongoose');
var passport = require('passport');
var Text = require('mongoose').model('Text').schema;

var userController = function (User) {
    var url = 'mongodb://localhost:27017/webApp';
    var db = mongoose.connect(url);

    //require login
    var middleware = function(req, res, next) {
        /*console.log(req);
        if (req.session && req.session.userID) {
            return next();
        } else {
            var err = new Error('You must be logged first to continue you action');
            err.status = 401;
            return next(err);
        }*/

        User.findById({_id:(req.params.id)}, function (err, user) {
            if (err) {
                res.status(500).send(err);
            } else if (user) {
                req.user = user;
                next();

            } else {
                res.status(404).send('User not found');
            }
        })};

    var getById = function (req, res) {
        res.json(req.user);
    };

    var addUser = function (req, res){
        var user = new User(req.body);

        user.save(function(err, user) {
                if (err) {
                    res.status(500).send(err);
                }else {
                    // 201= CREATED
                    res.status(201).json(user._id);
                }
        });
    };

    var updateUser = function (req, res) {
        //update a item
        req.user.userID = req.body.userID;
        req.user.firstName = req.body.firstName;
        req.user.lastName = req.body.lastName;
        req.user.username = req.body.username;
        req.user.password = req.body.password;
        req.user.save(function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(req.user);
            }
        });
    };

    var deleteUser = function (req, res) {
        req.user.remove(function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(204).send('User Removed');
            }
        });
    };

    var getUsers = function (req, res) {
        var query = req.query;
        User.find(query, function (err, users) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                /*res.render('textsListView', {
                 title: 'Texts',
                 nav: nav,
                 texts: texts
                 });*/
                res.send(users);
            }
        });

    };

    var SignOut =  function(req, res, next) {
        if (req.session) {
            // delete session object
            req.session.destroy(function(err) {
                if(err) {
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            });
        }
    };

    return {
        addUser: addUser,
        getById: getById,
        updateUser: updateUser,
        deleteUser: deleteUser,
        getUsers: getUsers,
        signOut: SignOut,
        middleware: middleware
    };
};

module.exports = userController;