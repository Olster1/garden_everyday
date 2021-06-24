var express = require('express')
const mongodb = require('mongodb');
const constants = require('../utils/constants');
const { checkToken, checkNoToken } = require('../utils/auth');
const path = require('path');

const goalModel = require(path.resolve(__dirname, '../models/goals.js'));

var router = express.Router();


////////////////////////////////////////////////////////////////////

var router = express.Router();

///////////////////////************ GET REQUETS *************////////////////////

router.post('/getGoals', checkToken, (req, httpRes, next) => {

	const userId = req.userId;

	goalModel.find({ ownerId: userId }, (err, documentResult) => {
		if(err) {
			return next(err);
		}

		httpRes.json({
			result: constants.SUCCESS,
			data: documentResult,
			message: "Retrieved Goals",
		});

	});
});

///////////////////////************* CREATE REQUESTS ************////////////////////

router.post('/createGoal', checkToken, (req, httpRes, next) => {

	const goal = new goalModel({
		name: req.body.name,
		objective: req.body.objective,
		ownerId: req.userId,
		complete: false
	});

	goal.save((err2, result) => {
		if(err2) {
			httpRes.json({
				result: constants.ERROR,
				data: {},
				message: 'error saving',
			});
		} else {
			httpRes.json({
				result: constants.SUCCESS,
				data: result,
				message: 'save successful',
			});
		}
	});
});

///////////////////////************ UPDATE REQUESTS *************////////////////////

router.post('/updateGoal', checkToken, (req, httpRes, next) => {
	const name = req.body.name;
	const objective = req.body.objective;
	const ownerId = req.userId;
	const complete = req.body.complete;
	const goalId = req.body.goalId

	goalModel.findOne({ _id: goalId, ownerId: ownerId }, (err, documentResult) => {
		if(err) {
			return next(err);
		}
		if(documentResult != null) { //found the goal
			goalModel.updateOne({ _id: goalId }, {name: name, objective: objective, ownerId: ownerId,  complete: complete, updated_at: new Date() }, (err2, documentResult) => {
				if(err2) {
					return next(err2);
				} else {
					httpRes.json({
						result: constants.SUCCESS,
						data: {},
						message: 'updated successful',
					});
				}
			});
		} else {
			httpRes.json({
				result: constants.ERROR,
				data: {},
				message: 'Goal Doesnt Exist',
			});
		}
	});
});

///////////////////////************* DELETE REQUESTS ************////////////////////

router.post('/deleteGoal', checkToken, (req, httpRes, next) => {
	const userId = req.userId;
	const goalId = req.body.goalId;
	
	goalModel.deleteOne({ _id: goalId }, (err2) => {
		if(err2) {
			return next(err2);
		} else {
			
			httpRes.json({
				result: constants.SUCCESS,
				data: {},
				message: 'deleted successful',
			});	
		}
	});
});


////////////////////////////////////////////////////////////////////

module.exports = router;