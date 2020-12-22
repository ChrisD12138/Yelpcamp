if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const methodOverride = require('method-override')
const User = require('./models/user')
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session')
const flash = require('connect-flash')
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local')
const campgroundRoute = require('./routes/campgrounds')
const reviewRoute = require('./routes/review')
const loginRoute = require('./routes/user');
const MongoStore = require('connect-mongo')(session);
const db_url = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
// process.env.DB_URL
mongoose.connect(db_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected");
});


app.listen(3000, () => {
    console.log('Serving on port 3000!!!')
})
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'))
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisisasecret';

const store = new MongoStore({
    url: db_url,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfigure = {
    store,
    secret,
    resave: false,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfigure))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/test', (req, res) => {
    res.send("hhhh")
})
app.post('/test', (req, res) => {
    console.log(req.body);
})

app.get('/', (req, res) => {
    res.render('home')
})

app.use('/', loginRoute);
app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/review', reviewRoute);

app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found!", 404));
})

app.use((err, req, res, next) => {
    const { statuscode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statuscode).render('error', { err });
})