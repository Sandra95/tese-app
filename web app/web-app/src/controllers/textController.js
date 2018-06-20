var mongoose = require('mongoose');

var ObjectID = require('mongodb').ObjectID;

var textController = function (Text) {
        var url = 'mongodb://localhost:27017/webApp';
        var db = mongoose.connect(url);

        var middleware =  function (req, res, next) {
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
        };

        var getTexts = function (req, res) {
            var query = req.query;
            Text.find(query, function (err, texts) {
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    /*res.render('textsListView', {
                     title: 'Texts',
                     nav: nav,
                     texts: texts
                     });*/
                    res.json(texts);
                }
            });
        };

        var getTextById = function (req, res) {
            //a parte de procurar o texto por id fica da responsabilidade do middleware que esta no textRoutes
            //se chegarmos a este. get significa que encontramos o texto ( next ())

            res.json(req.text);

            /*
             res.render('textsView', {
             title: 'Texts',
             nav: nav,
             text: results
             });*/
        };

        var addText = function (req, res) {
            var text = new Text(req.body);

            //guarda o text no mongo
            text.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                }else {
                    // 201= CREATED
                    res.status(201).json(text._id);

                }
            });
        };

        var updateText = function (req, res) {
            //update a item
            req.text.textID = req.body.textID;
            req.text.title = req.body.title;
            req.text.date = req.body.date;
            req.text.backGColor = req.body.backGColor;
            req.text.sections = req.body.sections;
            req.text.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.text);
                    /*
                     res.render('textsView', {
                     title: 'Texts',
                     nav: nav,
                     text: results
                     });*/
                }
            });
        };

        var deleteText = function (req, res) {
            req.text.remove(function (err) {
                if (err) {
                    res.status(500).send(err);
                }else {
                    res.status(204).send('Text Removed');
                }
            });
        };

        return {
            getTexts: getTexts,
            getTextById: getTextById,
            middleware: middleware,
            addText: addText,
            updateText: updateText,
            deleteText: deleteText
        };
    };

module.exports = textController;