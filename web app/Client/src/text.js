import {addSection_IDB} from "./indexeddb";
import {getSection_IDB} from "./indexeddb";
import {getSections_IDB} from "./indexeddb"
import {updateSection_IDB} from "./indexeddb"
import {deleteSection_IDB} from "./indexeddb"

import Section from "./sections";

export default class Text {
    constructor(id,title, backGColor,sections) {
        this.id=id;
        this.title = title;
        this.date = new Date();
        this.backGColor = backGColor;
        this.sections = sections;
    }

    addSection(idText, idSection, order, title, color, coordX, coordY, height, width, call) {

       addSection_IDB(idText,idSection,order,title,color,coordX,coordY,height,width, function (res) {
           call(res);
       })
    };

    updateSection(idText, order, section, call) {
        updateSection_IDB(idText,order,section,function (res) {
            call(res);
        })
    };

    getSections(idText, call) {
        getSections_IDB(idText,function (res) {
            call(res);
        });

    }

    getSection(idText,order, call) {
        getSection_IDB(idText,order, function (res) {
            call(res);
        });
    }

    deleteSection(idText, order , call) {
       deleteSection_IDB(idText,order, function (res) {
           call(res);
       })
    };
};



