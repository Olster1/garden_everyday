var express = require('express')
const mongodb = require('mongodb');
const constants = require('../utils/constants');
const { checkToken, checkNoToken } = require('../utils/auth');
const path = require('path');

const plantModel = require(path.resolve(__dirname, '../models/plant.js'));

var router = express.Router();


////////////////////////////////////////////////////////////////////

var router = express.Router();

///////////////////////************ GET REQUETS *************////////////////////

router.post('/getAllCommonPlantNames', (req, httpRes, next) => {

	const userId = req.userId;

	plantModel.find({ }, { CommonName: 1, Type: 1 }, (err, documentResult) => {
		if(err) {
			return next(err);
		}

		httpRes.json({
			result: constants.SUCCESS,
			data: documentResult,
			message: "Retrieved Plant Names",
		});

	});
});

router.post('/getAllPlants', (req, httpRes, next) => {

	const userId = req.userId;

	plantModel.find({ }, (err, documentResult) => {
		if(err) {
			return next(err);
		}

		httpRes.json({
			result: constants.SUCCESS,
			data: documentResult,
			message: "Retrieved Plants",
		});

	});
});

router.post('/getPlantsFromIds', (req, httpRes, next) => {
	const plantIds = req.body.ids;

	plantModel.find({ _id: { $in: plantIds } }, (err, documentResult) => {
		if(err) {
			return next(err);
		}

		httpRes.json({
			result: constants.SUCCESS,
			data: documentResult,
			message: "Retrieved Plants",
		});

	});
});



///////////////////////************* CREATE REQUESTS ************////////////////////

router.post('/createPlant', checkToken, (req, httpRes, next) => {

	
	const goal = new plantModel({
		CommonName: req.body.CommonName,
		LatinName: req.body.LatinName,
		PropagationMethod: req.body.PropagationMethod,
		TimeOfYearToPlant: req.body.TimeOfYearToPlant,
		Type: req.body.type
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

router.post('/updatePlant', checkToken, (req, httpRes, next) => {

	const CommonName = req.body.CommonName;
	const LatinName = req.body.LatinName;
	const PropagationMethod = req.body.PropagationMethod;
	const TimeOfYearToPlant = req.body.TimeOfYearToPlant;
	const plantType = req.body.type;
	const plantId = req.body.plantId


	plantModel.findOne({ _id: plantId }, (err, documentResult) => {
		if(err) {
			return next(err);
		}
		if(documentResult != null) { //found the goal
			plantModel.updateOne({ _id: plantId }, {CommonName: CommonName, LatinName: LatinName, PropagationMethod: PropagationMethod,  TimeOfYearToPlant: TimeOfYearToPlant, Type: plantType, updated_at: new Date() }, (err2, documentResult) => {
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
				message: 'Plant doesnt exist'
			});
		}
	});
});

///////////////////////************* DELETE REQUESTS ************////////////////////

router.post('/deletePlant', checkToken, (req, httpRes, next) => {
	const userId = req.userId;
	const plantId = req.body.plantId;
	
	plantModel.deleteOne({ _id: plantId }, (err2) => {
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