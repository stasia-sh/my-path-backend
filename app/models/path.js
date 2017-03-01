var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PathSchema   = new Schema({
    init_location: {
        latitude: Number,
        longitude: Number
    },
    name: String,
    legs: [{
        direction: Number,
        stepCount: Number
    }]
});

module.exports = mongoose.model('Path', PathSchema);