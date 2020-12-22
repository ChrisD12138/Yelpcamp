const express = require('express');
const CatchAsync = require('../utils/CatchAsync')
const review = require('../controllers/reviews');
const { isLoggedIn, isAuthor } = require('../middleware');

const route = express.Router({ mergeParams: true });

route.post('/', isLoggedIn, CatchAsync(review.postReview))

route.delete('/:reviewid', isLoggedIn, isAuthor, CatchAsync(review.deleteReview))

module.exports = route