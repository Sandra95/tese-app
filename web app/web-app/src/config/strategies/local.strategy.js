var passport = require('../passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../../models/userModel'),
    mongodb = require('mongodb').MongoClient;

module.exports = function () {
    passport.use(new LocalStrategy(User.authenticate()),

        //diz se é um sign in apropriado (user e pass certos)
        function (username, password, done) {
            //ir a bd ver se existe
            var url = 'mongodb://localhost:27017/webApp';
            console.log('Aqui');
            mongodb.connect(url, function (err, db) {
                User.FindById({
                    username: username
                }, function (err, results) {
                    if (results.password === password) {
                        //se estiver la o nosso user vai ser igual ao results (que suponho que sejam os dados o user)
                        var user = results;
                        done(null, user);
                    } else {
                        //o false --> não é truthy a authentication
                        done(null, false, {message: 'Incorrect Password'});
                    }
                });
            });
        });
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
};