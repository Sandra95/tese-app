
    let user = new User(0, "Sandra123", "1234", "Sandra", "Ferreira");

    user.getTexts(function (res) {
        console.log("executei");
    });

    user.updateColorText(0,"#123123",function (res) {
        console.log(res);
    });

    var text={
    backGColor:"#10001",
    date: 26/11/2017,
    id : 0,
    title: "As estrelas da Tigrinha"
	}

	user.updateText(0, text, function (res) {
    	console.log(res);
	});


	user.addText(1, "O Riqui não tem estrelas", "#00000", function (res) {
    console.log (res);
	});

	user.deleteText(1, function (res) {
    console.log(res);
});



user.addText(1, "Riki Riki", "#00000", function (text) {
    var new_text = new Text(text.id, text.title, text.backGColor);

    new_text.addSection(0,1,0,"Introdução", "#11111", 1, 2, 2,2,function (res) {
        console.log(res);
        console.log(new_text);
    })

});


