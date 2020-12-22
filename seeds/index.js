const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { descriptors, places } = require('./seedHelpers');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected");
});


const sample = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
const seedDB = async function () {
    await Campground.deleteMany({});
    for (let i = 0; i < 5; i++) {
        const rand1 = Math.floor(Math.random() * 1000);
        const pri = Math.floor(Math.random() * 100);
        const camp = new Campground({
            title: `${sample(descriptors)},${sample(places)}`,
            location: `${cities[rand1].city},${cities[rand1].state}`,
            description: 'beautiful',
            price: pri,
            author: '5fd9cc35a0a56e4b7c2ca923',
            images: [
                {
                    url: 'https://res.cloudinary.com/dmudk8oq6/image/upload/v1608291189/YelpCamp/zojidoz5b4ngvmcpzd7b.png',
                    filename: 'YelpCamp/zojidoz5b4ngvmcpzd7b'
                },
                {
                    url: 'https://res.cloudinary.com/dmudk8oq6/image/upload/v1608291181/YelpCamp/e1wp29sh1z6bvrnjrctg.jpg',
                    filename: 'YelpCamp/e1wp29sh1z6bvrnjrctg'
                }
            ]
        })
        camp.save();
    }
}

seedDB();