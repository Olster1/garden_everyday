const mongoose = require('mongoose');
const bcrypt  = require('bcrypt');

 const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	verificationHash: {
		type: String,
		required: true
	},
	accountVerified: {
		type: Boolean,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	name: {
		type: String, 
		required: true
	}

});

 const saltRounds = 10;

 UserSchema.pre('save', function(next) {
 	if (this.isNew || this.isModified('password')) {
 	    // Saving reference to this because of changing scopes
 	    const document = this;
 	    bcrypt.hash(document.password, saltRounds,
 	      function(err, hashedPassword) {
 	      if (err) {
 	        next(err);
 	      }
 	      else {
 	        document.password = hashedPassword;
 	        next();
 	      }
 	    });
 	  } else {
 	    next();
 	  }

 });


module.exports = mongoose.model('User', UserSchema);

