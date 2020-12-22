const express = require('express');
const route = express.Router({ mergeParams: true });
const User = require('../models/user')
const passport = require('passport')
const user = require('../controllers/users')

route.route('/login')
    .get( user.renderLogin)
    .post( passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),user.login)

route.route('/register')
    .get(user.renderRegisterform)
    .post(user.register)

route.get('/logout', user.logout)

module.exports = route;