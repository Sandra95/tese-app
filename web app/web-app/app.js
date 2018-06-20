var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');

var LocalStrategy = require('passport-local').Strategy;

//instancia do express
var app = express();
//env.port esta definido na task serve do gulp
var port = process.env.PORT || 5000;
var nav = [{
    Link:'/Text',
    Text:'Text'
}];

var userRouter = require('./src/routes/userRoutes')(nav);
var textRouter = require('./src/routes/textRoutes')(nav);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret:'my webApp'}));

app.set('views','./src/views');
app.set('view engine', 'ejs');

var texto = [{
    id: 1,
    date: '10-09-2017',
    title: 'Texto Exemplo',
    backGColor: '#20000',
    sections: [{
        id:0,
        order: 0,
        title: 'Introdução',
        color: '#22222',
        coordinateX : 2,
        coordinateY : 2,
        topics: [{
            id:0,
            order: 0,
            title: 'Contextualização',
            paragraph: 'bla bla bla',
            color: '#11111',
            coordinateX : 1,
            coordinateY : 1,
        },{
            id:1,
            order: 1,
            title: 'Dizer os topicos que vao ser abordados',
            paragraph: 'bla bla bla',
            color: '#11221',
            coordinateX : 3,
            coordinateY : 1,
        }
        ]
    }]
},
    {
    id: 2,
    date: '11-09-2017',
    title: 'Texto Exemplo 2',
    backGColor: '#20000',
    sections: []
    }
    ];

textRouter.route('/')
    .get(function (req, res) {
        res.render('textsListView', {
            title:'Texts',
            nav: [{
                Link:'/Texts',
                Text:'Texts1'}],
            texts: texto
        });
    });

textRouter.route('/single')
    .get(function (req, res) {
        res.send('Hello Single Text');
    });

app.use('/Texts', textRouter);
app.use('/Users', userRouter);

app.get('/', function (req, res) {
    'use strict';
    res.render('index',{title: 'Hi there ', nav: [{Link:'/Texts', Text:'Texts'}]});
});



app.listen(port, function (err) {
    'use strict';
    console.log('O servidor esta a espera de pedidos na porta ' + port);
});

