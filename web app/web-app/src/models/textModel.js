var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection('mongodb://localhost:27017/webAp');

autoIncrement.initialize(connection);


var textModel =  new Schema ({
    title: {type: String, unique: true},
    date:{type: Date},
    backGColor: {type: String},
    sections:[
        {
        order: {type: Number},
        title: {type: String,unique: true},
        color: {type: String},
        coordinateX: {type: Number},
        coordinateY: {type: Number},
        height: {type: Number},
        width: {type: Number},
        topics: [
            {
            order: {type: Number},
            title: {type: String, unique: true},
            paragraph: {type: String},
            color: {type: String},
            coordinateX: {type: Number},
            coordinateY: {type: Number},
            height: {type: Number},
            width: {type: Number},
        }]
    }]
});
textModel.plugin(autoIncrement.plugin, 'Text');
module.exports = mongoose.model('Text', textModel);