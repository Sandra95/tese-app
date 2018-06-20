const DB_NAME = "Textos";
const DB_VERSION = 1; // Use a long long for this value (don't use a float)
const DB_STORE_NAME = "My_Texts";


import Topic from "./topics";
import Section from "./sections";
import Text from "./text";

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



export function addText_IDB(text, call) {
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

export function getTexts_IDB(call) {
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

export function updateColorText_IDB(idText, color, call) {
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

export function updateText_IDB(idText, objText, call) {
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

export function deleteText_IDB(idText, call) {
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



export function addSection_IDB(idText, idSection, order, title, color, coordX, coordY, height, width, call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var requestGet = store.get(idText);

        requestGet.onsuccess = function (event) {
            var data = event.target.result;
            var new_section = new Section(idSection, order, title, color, coordX, coordY, height, width, []);
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

export function updateSection_IDB(idText, order, section, call) {
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

export function getSections_IDB(idText, call) {
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

export function getSection_IDB(idText, order, call) {
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

export function deleteSection_IDB(idText,order) {
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



export function addTopic_IDB(idText, sectionOrder, idTopic, title, topicOrder, color, coordX, coordY, height, width, call) {
    openDB(function (db) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var requestGet = store.get(idText);

        var new_topic= new Topic(idTopic,topicOrder,title,color,coordX,coordY, height, width,[]);

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

export function getTopic_IDB(idText, sectionOrder, topicOrder, call) {
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

export function getTopics_IDB(idText,sectionOrder, call) {
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

export function updateTopic_IDB(idText,sectionOrder, topicOrder, topic, call) {
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

export function deleteTopic_IDB(idText,sectionOrder, topicOrder) {
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


