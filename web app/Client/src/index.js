import User from "./user";
import Text from "./text";
import Section from "./sections";
import Topic from "./topics";

let user = new User(0, "Sandra123", "1234", "Sandra", "Ferreira");



user.addText(1, "Riki Riki 1", "#00000", function (text) {
    var new_text= text;
    console.log("Add Text ok");


    new_text.addSection(1,0,0,"Intro", "#68e535", 1, 2, 2, 2, function (res) {
        var section= res;

        section.addTopic(1,0,1,1,"Topico2","#111",1,1,2,2, function (res) {
            console.log("Topic Added");
        });
        section.addTopic(1,0,2,0,"Topico1","#111",1,1,2,2, function (res) {
            console.log("Topic Added");
        });

        section.getTopics(1,0,function (res) {
            console.log(res);
        });

        section.deleteTopic(1,0,2, function (res) {
            console.log(res);
        })
    });

});

/*
user.deleteText(1, function (res) {
    console.log(res);
});
*/
