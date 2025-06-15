const mongoose = require('mongoose');

const imgSchema = new mongoose.Schema({
    img_id: Number,
    url: String,
    answer: String, /* S1E01 */
    title: String,
    difficulty: String,

})

imgSchema.index({ answer: 1, img_id: 1 }, { unique: true });

module.exports = mongoose.model('Image', imgSchema);