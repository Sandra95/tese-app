var express = require('express');
var userRouter = express.Router();
var mongoose = require('mongoose');
var objectId = require('mongodb').ObjectID;
var passport = require('passport');
var User = require('../models/userModel');

var userController = require('../controllers/userController')(User);


var router = function (nav) {

    //middlewere que vai procurar o user por id na bd
    userRouter.use('/:id',userController.middleware);

    userRouter.route('/signOut')
        .get(userController.signOut);

    userRouter.route('/:id')
        .get(userController.getById)
        .put(userController.updateUser)
        .delete(userController.deleteUser);


    userRouter.route('/')
        .get(userController.getUsers)
        .post(userController.addUser);

    return userRouter;
};

module.exports = router;

