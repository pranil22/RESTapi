var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

var User = mongoose.model('User', userSchema);

module.exports = User;