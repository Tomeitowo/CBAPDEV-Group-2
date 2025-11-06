const express = require('express');
const path = require('path');

const profileController = require('../controllers/profileController.js');
const homeController = require('../controllers/homeController.js');
const registerController = require('../controllers/registerController.js');
const sessionsController = require('../controllers/sessionsController.js');
const goalsController = require('../controllers/goalsController.js');
const moodController = require('../controllers/moodController.js');
const insightsController = require('../controllers/insightsController.js');
const controller = require('../controllers/controller.js');

const app = express();

app.get('/', controller.getIndex);

app.get('/profile', profileController.getProfile);

app.get('/register', registerController.getRegister);

app.get('/home', homeController.getHome);

app.get('/sessions', sessionsController.getSessions);

app.get('/goals', goalsController.getGoals);

app.get('/mood', moodController.getMood);

app.get('/insights', insightsController.getInsights);

app.post('/login', homeController.getHome);

app.post('/register', controller.getIndex); //switch to success page

module.exports = app;
