const mongoose = require('mongoose');

 const UserSettingsSchema = new mongoose.Schema({
	climateRegion: {
		type: String,
		required: true
	},
	gpsSet: {
		type: Boolean,
		required: true
	},
	address1: {
		type: String,
		required: false
	},
	address2: {
		type: String,
		required: false
	},
	suburb: {
		type: String,
		required: false
	},	
	postcode: {
		type: Number,
		required: false
	},
	state: {
		type: String,
		required: false
	},
	latitude: {
		type: Number,
		required: true
	},
	longitude: {
		type: Number,
		required: true
	},
	plantIds: {
		type: [mongoose.Schema.Types.ObjectId], 
		required: true
	},

	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},

	ownerId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},


});


 UserSettingsSchema.pre('save', function(next){
     now = new Date();

     this.updated_at = now;
     this.created_at = now;

     next();
 });



module.exports = mongoose.model('UserSettings', UserSettingsSchema);

