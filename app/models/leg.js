var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var LegSchema    = new Schema({
    direction: Number,
    stepCount: Number
});

module.exports = mongoose.model('Leg', LegSchema);