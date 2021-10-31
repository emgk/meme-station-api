const mongoose = require('mongoose');

const foldersSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model('Folders', foldersSchema);