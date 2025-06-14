const mongoose = require('mongoose');

const imgSchema = new mongoose.Schema({
    url: String,
    answer: String, /* S1E01 */
    difficulty: String,

})

module.exports = mongoose.model('Image', imgSchema);