/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = addText_IDB;
/* harmony export (immutable) */ __webpack_exports__["i"] = getTexts_IDB;
/* harmony export (immutable) */ __webpack_exports__["l"] = updateColorText_IDB;
/* harmony export (immutable) */ __webpack_exports__["n"] = updateText_IDB;
/* harmony export (immutable) */ __webpack_exports__["e"] = deleteText_IDB;
/* harmony export (immutable) */ __webpack_exports__["a"] = addSection_IDB;
/* harmony export (immutable) */ __webpack_exports__["m"] = updateSection_IDB;
/* harmony export (immutable) */ __webpack_exports__["h"] = getSections_IDB;
/* harmony export (immutable) */ __webpack_exports__["g"] = getSection_IDB;
/* harmony export (immutable) */ __webpack_exports__["d"] = deleteSection_IDB;
/* harmony export (immutable) */ __webpack_exports__["c"] = addTopic_IDB;
/* harmony export (immutable) */ __webpack_exports__["j"] = getTopic_IDB;
/* harmony export (immutable) */ __webpack_exports__["k"] = getTopics_IDB;
/* harmony export (immutable) */ __webpack_exports__["o"] = updateTopic_IDB;
/* harmony export (immutable) */ __webpack_exports__["f"] = deleteTopic_IDB;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__topics__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sections__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__text__ = __webpack_require__(3);
const DB_NAME = "Textos";
const DB_VERSION = 1; // Use a long long for this value (don't use a float)
const DB_STORE_NAME = "My_Texts";






var db;
function openDB(call) {
    console.log("Opening database...");
    var request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = function (event) {
        db = this.result;
        console.log("Opening DB Done");
        call(db);
    };

    request.onerror = function (event) {
        console.error("openDB", event.target.errorCode);
    };

    request.onupgradeneeded = function (event) {
        console.log("openDb.onupgradeneeded");
        //Criar ObjectStore vazio para o autor Sandra
        var objectStore = event.currentTarget.result.createObjectStore(DB_STORE_NAME, {
            keyPath: "id",
            autoIncrement: true
        });
        objectStore.createIndex("title", "title", {unique: true});
    };
};

function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
};

function clearObjectStore(store_name) {
    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req = store.clear();
    req.onsuccess = function (evt) {
        displayActionSuccess("Store cleared");
        displayPubList(store);
    };
    req.onerror = function (evt) {
        console.error("clearObjectStore:", evt.target.errorCode);
        displayActionFailure(this.error);
    };
};



function addText_IDB(text, call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var requestAdd = store.add(text);
        requestAdd.onsuccess = function (event) {
            call(text);
        };
        requestAdd.onerror = function (event) {
            console.log(event.target.error);
        };
    })
};

function getTexts_IDB(call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var request = store.getAll();
        var texts = [];
        request.onsuccess = function (event) {
            var res = request.result;
            for (var i = 0; i < res.length; i++) {
                var obj = {
                    id: res[i].id,
                    title: res[i].title,
                    date: res[i].date,
                    backGColor: res[i].backGColor
                };
                texts.push(obj);
            }
            call(texts);
        };
        request.onerror = function (event) {
            console.log(event.target.error);
        };
    })
};

function updateColorText_IDB(idText, color, call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var request = store.get(idText);

        request.onsuccess = function (event) {
            var data = event.target.result;
            data.backGColor = color;
            data.date = new Date();
            call({id: data.id, title: data.title, date: data.date, backGColor: data.backGColor});
        };

        request.onerror = function (event) {
            console.log(event.target.error);
        }
    })
};

function updateText_IDB(idText, objText, call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var request = store.get(idText);

        request.onsuccess = function (event) {
            var requestUpdate = store.put(objText);

            requestUpdate.onsuccess = function (event) {
                var requestAgain = store.get(idText);
                requestAgain.onsuccess = function (event) {
                    var data = event.target.result;
                    data.date = new Date();
                    call({id: data.id, title: data.title, date: data.date, backGColor: data.backGColor});
                };
            };

            requestUpdate.onerror = function (event) {
                console.log(event.target.error);
            };
        };
        request.onerror = function (event) {
            console.log(event.target.error);
        };
    });


};

function deleteText_IDB(idText, call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var request = store.get(idText);

        request.onsuccess = function (event) {
            var objectStoreRequest = store.delete(idText);

            objectStoreRequest.onsuccess = function (event) {
                console.log("Text Deleted!");
            };
            objectStoreRequest.onerror = function (event) {
                console.log(event.target.error);
            };
        }

        request.onerror = function (event) {
            console.log(event.target.error);
            call(event.target.error);
        };
    });
};



function addSection_IDB(idText, idSection, order, title, color, coordX, coordY, height, width, call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var requestGet = store.get(idText);

        requestGet.onsuccess = function (event) {
            var data = event.target.result;
            var new_section = new __WEBPACK_IMPORTED_MODULE_1__sections__["a" /* default */](idSection, order, title, color, coordX, coordY, height, width, []);
            data.sections.push(new_section);
            data.sections.sort(function(a, b){return a.order - b.order});
            data.date = new Date();
            var requestPut = store.put(data);

            requestPut.onsuccess = function (event){
                call(
                    /*{
                    id: data.id,
                    order: data.order,
                    title: data.title,
                    color: data.color,
                    coordinateX: data.coordinateX,
                    coordinateY: data.coordinateY,
                    height: data.height,
                    width: data.width,
                    topics: data.topics
                });*/
                    new_section)
            };

            requestPut.onerror = function (event) {
                console.log(event.target.error);
            };
        }
        requestGet.onerror = function (event) {
            console.log(event.target.error);
        };
    });
};

function updateSection_IDB(idText, order, section, call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var requestGet = store.get(idText);

        requestGet.onsuccess = function (event) {
            var data = event.target.result;
            data.sections[order] = section;
            data.date = new Date();
            var requestPut = store.put(data);

            requestPut.onsuccess = function (event) {
                call({
                    id: data.id,
                    order: data.order,
                    title: data.title,
                    color: data.color,
                    coordinateX: data.coordinateX,
                    coordinateY: data.coordinateY
                });
            }
            requestPut.onerror = function (event) {
                console.log(event.target.error);
            };
        };

        requestGet.onerror = function (event) {
            console.log(event.target.error);
        };
    });
}

function getSections_IDB(idText, call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var requestGet = store.get(idText);

        requestGet.onsuccess = function (event) {
            var data = event.target.result;
            var sections = data.sections;
            var sectionsA = [];
            for (var i = 0; i < sections.length; i++) {
                sectionsA[i] = {
                    id: sections[i].id,
                    title: sections[i].title,
                    order: sections[i].order,
                    color: sections[i].color,
                    coordinateX: sections[i].coordinateX,
                    coordinateY: sections[i].coordinateY,
                    height: sections[i].height,
                    width: sections[i].width,
                    topics: sections[i].topics
                }
            }
            call(sectionsA);
        }
        requestGet.onerror = function (event) {
            console.log(event.target.error);
        }
    });
}

function getSection_IDB(idText, order, call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var requestGet = store.get(idText);

        requestGet.onsuccess = function (event) {
            var data = event.target.result;
            var sections = data.sections[order];
            call({
                id: sections.id,
                order: sections.order,
                title: sections.title,
                color: sections.color,
                coordinateX: sections.coordinateX,
                coordinateY: sections.coordinateY,
                height: sections.height,
                width: sections.width,
                topics: sections.topics
            })
        }
        requestGet.onerror = function (event) {
            console.log(event.target.error);
        }
    });
}

function deleteSection_IDB(idText,order) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var request = store.get(idText);

        request.onsuccess = function (event) {
            var data = event.target.result;
            data.sections.splice(order,1);
            data.date= new Date();
            var requestUpdate = store.put(data);
            requestUpdate.onsuccess = function (event) {
                console.log("Section deleted !");
            };
            requestUpdate.onerror = function (event) {
                console.log(event.target.error);
            };

        };
        request.onerror = function (event) {
            console.log(event.target.error);
        };

    });
};



function addTopic_IDB(idText, sectionOrder, idTopic, title, topicOrder, color, coordX, coordY, height, width, call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var requestGet = store.get(idText);

        var new_topic= new __WEBPACK_IMPORTED_MODULE_0__topics__["a" /* default */](idTopic,topicOrder,title,color,coordX,coordY, height, width,[]);

        requestGet.onsuccess = function (event) {
            var data = event.target.result;
            data.sections[sectionOrder].topics.push(new_topic);

            data.sections[sectionOrder].topics.sort(function(a, b){return a.order - b.order});
            data.date = new Date();
            var requestPut = store.put(data);

            requestPut.onsuccess = function (event) {
                call(new_topic);
            };
            requestPut.onerror = function (event) {
                console.log(event.target.error);
            };

        };
        requestGet.onerror = function (event) {
            console.log(event.target.error);
        };
    })
};

function getTopic_IDB(idText, sectionOrder, topicOrder, call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var requestGet = store.get(idText);

        requestGet.onsuccess = function (event) {
            var data = event.target.result;
            var topic = data.sections[sectionOrder].topics[topicOrder];

            call(topic);
        }
        requestGet.onerror = function (event) {
            console.log(event.target.error);
        }
    })

};

function getTopics_IDB(idText,sectionOrder, call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var requestGet = store.get(idText);

        requestGet.onsuccess = function (event) {
            var data = event.target.result;
            var topics = data.sections[sectionOrder].topics;

            call(topics);
        };

        requestGet.onerror = function (event) {
            console.log(event.target.error);
        };
    })

};

function updateTopic_IDB(idText,sectionOrder, topicOrder, topic, call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var requestGet = store.get(idText);

        requestGet.onsuccess = function (event) {

            var data = event.target.result;

            data.sections[sectionOrder].topics[topicOrder] = topic;
            data.date= new Date();
            var requestPut = store.put(data);

            requestPut.onsuccess = function (event) {
                call(data.sections[sectionOrder].topics[topicOrder]);
            };

            requestPut.onerror = function (event) {
                console.log(event.target.error);
            };

        };

        requestGet.onerror = function (event) {
            console.log(event.target.error);
        };
    })
};

function deleteTopic_IDB(idText,sectionOrder, topicOrder) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var request = store.get(idText);

        request.onsuccess = function (event) {
            var data = event.target.result;
            var topics = data.sections[sectionOrder].topics.splice(topicOrder, 1);
            data.date= new Date();
            var requestPut = store.put(data);
            requestPut.onsuccess = function (event) {
                console.log("Topic Deleted");
            };
            requestPut.onerror = function (event) {
                console.log(event.target.error);
            };
        };

        request.onerror = function (event) {
            console.log(event.target.error);
        };
    })
};




/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const DB_NAME = "Textos";
const DB_VERSION = 1; // Use a long long for this value (don't use a float)
const DB_STORE_NAME = "My_Texts";

var db;

class Topic {
    constructor(id, order, title,color,coordinateX,coordinateY,height,width) {
        this.id = id; //id is generated by server?
        this.order = order;
        this.paragraph= "";
        this.title = title;
        this.color = color;
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
        this.height = height;
        this.width = width;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Topic;





/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__indexeddb__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__topics__ = __webpack_require__(1);








class Section {
    constructor(id, order, title, color, coordinateX, coordinateY, height, width, topics) {
        this.id = id; //id is generated by server?
        this.order = order;
        this.title = title;
        this.color = color;
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
        this.height = height;
        this.width = width;
        this.topics = topics;
    }

    addTopic(idText,sectionOrder,idTopic,topicOrder, title, color, coordX, coordY, height, width, call) {
        Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["c" /* addTopic_IDB */])(idText,sectionOrder,idTopic,title,topicOrder,color,coordX,coordY,height,width, function (res) {
            call(res);
        })
    };

    getTopics(idText, sectionOrder,  call) {
       Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["k" /* getTopics_IDB */])(idText,sectionOrder,function (res) {
           call(res);
       })
    };

    getTopic(idText, sectionOrder, topicOrder, call){
        Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["j" /* getTopic_IDB */])(idText,sectionOrder,topicOrder, function (res) {
            call(res);
        })
    }

    updateTopic(idText,sectionOrder, topicOrder, topic, call) {
        Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["o" /* updateTopic_IDB */])(idText,sectionOrder,topicOrder,topic, function (res) {
            call(res);
        })
    };

    deleteTopic(idText, sectionOrder, topicOrder) {
        Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["f" /* deleteTopic_IDB */])(idText,sectionOrder,topicOrder)
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Section;





/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__indexeddb__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sections__ = __webpack_require__(2);








class Text {
    constructor(id,title, backGColor,sections) {
        this.id=id;
        this.title = title;
        this.date = new Date();
        this.backGColor = backGColor;
        this.sections = sections;
    }

    addSection(idText, idSection, order, title, color, coordX, coordY, height, width, call) {

       Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["a" /* addSection_IDB */])(idText,idSection,order,title,color,coordX,coordY,height,width, function (res) {
           call(res);
       })
    };

    updateSection(idText, order, section, call) {
        Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["m" /* updateSection_IDB */])(idText,order,section,function (res) {
            call(res);
        })
    };

    getSections(idText, call) {
        Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["h" /* getSections_IDB */])(idText,function (res) {
            call(res);
        });

    }

    getSection(idText,order, call) {
        Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["g" /* getSection_IDB */])(idText,order, function (res) {
            call(res);
        });
    }

    deleteSection(idText, order , call) {
       Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["d" /* deleteSection_IDB */])(idText,order, function (res) {
           call(res);
       })
    };
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Text;
;





/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__user__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__text__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sections__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__topics__ = __webpack_require__(1);





let user = new __WEBPACK_IMPORTED_MODULE_0__user__["a" /* default */](0, "Sandra123", "1234", "Sandra", "Ferreira");



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


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__indexeddb__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__text__ = __webpack_require__(3);







class User {
    constructor(id, username, password, firstName, lastName, texts) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.texts = texts;
    }



    addText(idText,title, backGColor,call) {
        var text= new __WEBPACK_IMPORTED_MODULE_1__text__["a" /* default */] (idText, title,backGColor, []);
        Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["b" /* addText_IDB */])(text, function (result) {
             call(result);
         });
    };

    getTexts(call) {
        Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["i" /* getTexts_IDB */])(function (result) {
            call(result);
        })
    };

    updateColorText(idText, color, call) {
        Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["l" /* updateColorText_IDB */])(idText,color, function (result) {
            call(result);
        })
    };

    updateText(idText, objText, call) {
        Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["n" /* updateText_IDB */])(idText,objText,function (result) {
            call(result);
        });
    };

    deleteText(idText, call) {
        Object(__WEBPACK_IMPORTED_MODULE_0__indexeddb__["e" /* deleteText_IDB */])(idText, function (res) {
            call(res);
        })
    };

}
/* harmony export (immutable) */ __webpack_exports__["a"] = User;


/***/ })
/******/ ]);