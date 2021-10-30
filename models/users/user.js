const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// create schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    }
});

userSchema.pre('save', function(next) {
    const user = this;

    if ( this.isModified('password') || this.isNew ) {
        bcrypt.genSalt(10, (err, salt) => {
            if ( err) return next(err);
            bcrypt.hash(user.password, salt,(err, hash )=>{
                if ( err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
} );

// compare user password against password
userSchema.methods.comparePassword = function(password, cb ) {
    bcrypt.compare( password, this.password, function(err, isMatch) {
        if ( err ) return cb(err);
        cb(null, isMatch);
    });
}

module.exports = mongoose.model('User', userSchema);