const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    userId: {
        type: String,
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
    imageUrl: {
        type: String,
        require: false,
    },
    privacy: {
        type: String,
        require: true,
    }
});

folderSchema.set('timestamps',true);

module.exports = mongoose.model('Folder', folderSchema);