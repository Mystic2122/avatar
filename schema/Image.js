const mongoose = require('mongoose');

const imgSchema = new mongoose.Schema({
    img_id: {
        type: Number, 
        rquired:true
    },
    
    url: {
        type: String,
        required:true
    },
    answer: String, /* S1E01 */
    title: String,
    season: Number,
    difficulty: String,

})

imgSchema.index({ answer: 1, img_id: 1 }, { unique: true });

module.exports = mongoose.model('Image', imgSchema);