const mongoose = require('mongoose');

// meme schema
const memeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: false,
    },
    tags: {
        type: String,
        require: false,
    },
    folderId: {
        type: mongoose.Types.ObjectId,
        require: false,
    },
    imageUrl: {
        type: String,
        require: true,
    },
    privacy: {
        type: String,
        require: true,
    }
});

memeSchema.set('timestamps',true);

module.exports = mongoose.model('Meme',memeSchema);