const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.deleteReview = async (req, res) => {
    const { id, reviewid } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    const review = await Review.findByIdAndDelete(reviewid);
    campground.save();
    review.save();
    req.flash('success','Successfully deleted a review')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.postReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    review.username = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created a new review');
    res.redirect(`/campgrounds/${campground._id}`);
}