const express = require('express');
const campground = require('../controllers/campgrounds')
const CatchAsync = require('../utils/CatchAsync')
const route = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });

route.route('/')
    .get(isLoggedIn, CatchAsync(campground.index))
    .post(isLoggedIn, upload.array('images'), validateCampground, CatchAsync(campground.createCampground))

route.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(campground.editCampground))
route.get('/new', isLoggedIn, CatchAsync(campground.renderNewForm));

route.route('/:id')
    .get(isLoggedIn, CatchAsync(campground.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('images'), validateCampground, CatchAsync(campground.updateCampground))
    .delete(isLoggedIn, isAuthor, CatchAsync(campground.deleteCampground))


module.exports = route