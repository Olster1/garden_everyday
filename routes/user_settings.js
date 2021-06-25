const express = require('express')
const mongodb = require('mongodb');
const constants = require('../utils/constants');
const { checkToken, checkNoToken } = require('../utils/auth');
const path = require('path');

const userSetModel = require(path.resolve(__dirname, '../models/user_settings.js'));
const userModel = require(path.resolve(__dirname, '../models/users.js'));

const router = express.Router();


////////////////////////////////////////////////////////////////////



///////////////////////************ GET REQUETS *************////////////////////

router.post('/getUserSettings', checkToken, (req, httpRes, next) => {

	const userId = req.userId;

	userSetModel.findOne({ ownerId: userId }, (err, documentResult) => {
		if(err) {
			return next(err);
		}

		httpRes.json({
			result: constants.SUCCESS,
			data: documentResult,
			message: "Retrieved User Settings",
		});

	});
});

router.post('/getAllPlants', (req, httpRes, next) => {

	const userId = req.userId;

	userSetModel.find({ }, (err, documentResult) => {
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

router.post('/createUserSettings', checkToken, (req, httpRes, next) => {

	const userSet = new userSetModel({
		climateRegion: req.body.climateRegion,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		plantIds: [],
		ownerId: req.userId,
		gpsSet: req.body.gpsSet
	});

	userSetModel.findOne({ ownerId: req.userId }, (err, documentResult) => {
		if(err) {
			return next(err);
		}
		if(documentResult == null) { //found the settings

			userSet.save((err2, result) => {
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
		} else {
			httpRes.json({
				result: constants.SUCCESS,
				data: result,
				message: 'settings already exist'
			});
		}
	});
});

///////////////////////************ UPDATE REQUESTS *************////////////////////

router.post('/saveSettings', checkToken, (req, httpRes, next) => {

	let settings = req.body;

	settings.updated_at = new Date();

	userSetModel.updateOne({ _id: settings._id }, settings, (err2, documentResult) => {
		if(err2) {
			return next(err2);
		} else {
			//NOTE: Save to database saying they've set up the profile now
			userModel.updateOne({ _id: req.userId }, { setUpProfile: true }, (err3, documentResult) => {
				if(err3) {
					return next(err3);
				} else {
					httpRes.json({
						result: constants.SUCCESS,
						data: {},
						message: 'updated successful',
					});
				}
			});
		}
	});
});

router.post('/addOrRemovePlant', checkToken, (req, httpRes, next) => {

	let findQuery = {};

	if(req.body.shouldRemove) {
		findQuery = { ownerId: req.userId, plantIds: { $in: [ req.body.plantId ] } };
	} else {
		findQuery = { ownerId: req.userId, plantIds: { $nin: [ req.body.plantId ] } };
	}

	userSetModel.findOne(findQuery, (err, documentResult) => {
		if(err) {
			return next(err);
		}
		if(documentResult != null) { //found the record - don't need to create a new one

			let queryObj = {};

			if(req.body.shouldRemove) {
				queryObj = { $pull: { plantIds: { $in: [ req.body.plantId ] } }, updated_at: new Date() }
			} else {
				queryObj = { $push: { plantIds: req.body.plantId }, updated_at: new Date() };
			}

			userSetModel.updateOne({ ownerId: req.userId }, queryObj, (err2, documentResult) => {
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
				result: constants.SUCCESS,
				data: {},
				message: 'no document to update',
			});
		}
	});
});



///////////////////////************* DELETE REQUESTS ************////////////////////

router.post('/deletePlant', checkToken, (req, httpRes, next) => {
	const userId = req.userId;
	const plantId = req.body.plantId;
	
	userSetModel.deleteOne({ _id: plantId }, (err2) => {
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
