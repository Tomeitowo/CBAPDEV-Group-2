const express = require('express');
const hbs = require('hbs');
const routes = require('./routes/routes.js');

const profileController = require('./controllers/profileController.js');

const app = express();
const port = 3000;

app.set('view engine', 'hbs');

app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));

app.use('/', routes);

app.use(function (req, res) {
    res.render('error');
});

app.listen(port, function () {
    console.log('app listening at port ' + port);
});