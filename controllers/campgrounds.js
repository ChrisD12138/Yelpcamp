const Campground = require('../models/campground')
const Review = require('../models/review')
const { cloudinary } = require('../cloudinary')
module.exports.index = async function (req, res) {
    const campgrounds = await Campground.find({}).populate('author');
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = async function (req, res) {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    const camp = new Campground(req.body.campground);
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully created a new campground')
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCampground = async function (req, res) {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    const reviewId = []
    campground.reviews.forEach((item, index) => {
        reviewId[index] = item._id;
    })
    const allreview = await Review.find({});
    const reviews = await Review.find({ _id: { $in: reviewId } }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find this campground!!!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground, reviews });
}

module.exports.editCampground = async function (req, res) {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs)
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({
            $pull: {
                images: { filename: { $in: req.body.deleteImages } }
            }
        })
    }
    req.flash('success', 'Successfully update a campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    const imgToDelet = campground.images
    console.log(imgToDelet);
    for (let img of imgToDelet) {
        cloudinary.uploader.destroy(img.filename);
    }
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campgrounds');
}