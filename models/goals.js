const mongoose = require('mongoose');

 const GoalSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	objective: {
		type: String,
		required: true
	},
	complete: {
		type: Boolean, 
		required: true
	},
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},

	ownerId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},


});


 GoalSchema.pre('save', function(next){
     now = new Date();

     this.updated_at = now;
     this.created_at = now;

     next();
 });



module.exports = mongoose.model('Goal', GoalSchema);

