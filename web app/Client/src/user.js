import {addText_IDB} from "./indexeddb";
import {getTexts_IDB} from "./indexeddb";
import {updateColorText_IDB} from "./indexeddb"
import {updateText_IDB} from "./indexeddb"
import {deleteText_IDB} from "./indexeddb"

import Text from "./text";
export default class User {
    constructor(id, username, password, firstName, lastName, texts) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.texts = texts;
    }



    addText(idText,title, backGColor,call) {
        var text= new Text (idText, title,backGColor, []);
        addText_IDB(text, function (result) {
             call(result);
         });
    };

    getTexts(call) {
        getTexts_IDB(function (result) {
            call(result);
        })
    };

    updateColorText(idText, color, call) {
        updateColorText_IDB(idText,color, function (result) {
            call(result);
        })
    };

    updateText(idText, objText, call) {
        updateText_IDB(idText,objText,function (result) {
            call(result);
        });
    };

    deleteText(idText, call) {
        deleteText_IDB(idText, function (res) {
            call(res);
        })
    };

}