const mongoose = require('mongoose');

var LogSchema = new mongoose.Schema({
     
    telegram_id : { type: String, unique: true},
    username : String,
    last_use : Date
});

module.exports = mongoose.model('Log', LogSchema);