// first name, last name, email, username, password, deleted, admin
var mongoose = require('mongoose');

var coffeeSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    }
})


var Coffee = mongoose.model('coffee', coffeeSchema);

module.exports = Coffee