const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    fullname: String,
    firstname: String,
    lastname: String,
    email: String,
    country: String,
    role: String,
    summary: String,
    links: [
        {
            title: String,
            url: String,
            description: String,
        }
    ],
});

module.exports = mongoose.model('Profile', profileSchema);