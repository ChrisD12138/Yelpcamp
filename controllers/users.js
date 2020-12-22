const Review = require('../models/review')
const Campground = require('../models/campground')
const User = require('../models/user')


module.exports.login = (req, res) => {
    req.flash('success', 'Successfully logged in')
    const returnUrl = req.session.returnTo || '/campgrounds';
    res.redirect(returnUrl)
}

module.exports.renderRegisterform = (req, res) => {
    res.render('user/register')
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
        })
        req.flash('success', 'Successfully registered an acount!')
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}


module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out!')
    res.redirect('/campgrounds')
}

module.exports.renderLogin = (req, res) => {
    res.render('user/login');
}