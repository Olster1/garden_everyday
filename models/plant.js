const mongoose = require('mongoose');

 const PlantSchema = new mongoose.Schema({
	CommonName: {
		type: String,
		required: true
	},
	LatinName: {
		type: String,
		required: true
	},
	PropagationMethod: {
		type: String,
		required: true
	},
	TimeOfYearToPlant: {
		type: [Object], //NOTE: the time of year to plant for each climatic zone 
		required: true
	},

	Type: {
		type: String,
		required: true
	},

	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},

});


 PlantSchema.pre('save', function(next){
     now = new Date();

     this.updated_at = now;
     this.created_at = now;

     next();
 });



module.exports = mongoose.model('Plant', PlantSchema);

