var express = require('express');
var textRouter = express.Router();
var objectId = require('mongodb').ObjectID;
var Text = require('../models/textModel');
var textController = require('../controllers/textController')(Text);


var router = function (nav) {

    //middlewere que vai procurar o texto por id na bd e só se existir é que ele continua
    textRouter.use('/:id', function (req, res, next) {
        Text.findById({_id:(req.params.id)}, function (err, text) {
            if (err) {
                res.status(500).send(err);
            } else if (text){
                req.text = text;
                next();

            } else {
                res.status(404).send('Text not found');
            }
        });
    });

    textRouter.route('/')
        .get(textController.getTexts)
        .post(textController.addText);

    textRouter.route('/:id')
        .get(textController.getTextById)
        .put(textController.updateText)
        .delete(textController.deleteText);

    return textRouter;
};

module.exports = router;


