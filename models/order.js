// first name, last name, email, username, password, deleted, admin
var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    itemName: {
        type: String,
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


var Order = mongoose.model('order', orderSchema);

module.exports = Order