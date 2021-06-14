const express = require('express')
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt  = require('bcrypt');

const constants = require('../utils/constants');
const { checkToken, checkNoToken } = require('../utils/auth');
const path = require('path');

const userModel = require(path.resolve(__dirname, '../models/users.js'));

var router = express.Router();

router.get('/:username/:id', (req, res, next) => {

	const hashId = req.params.id;
	const email = req.params.username;


	userModel.find({ email: email }, (err, documentResult) => {
		if(err) {
			//NOTE(ollie): go to the express middleware to handle error
			return next(err);
		}

		if(documentResult.length > 0) {
			//NOTE(ol): user exists

			console.log(documentResult);

			const userInfo = documentResult[0];

			if(!userInfo.accountVerified) {
				if(userInfo.verificationHash === hashId) {

					//NOTE: Update database to say it has been verified

					userModel.updateOne({ _id: userInfo._id }, { accountVerified: true }, (err2, documentResult) => {
						if(err2) {
							console.log("err 1");
							console.log(err2);
							return next(err2);
						}

						//NOTE: Notify user their account is verified
						res.sendFile(path.resolve(__dirname, "../public/html_files/verify-register.html"), function (err){
							if(err) {
								console.log("err 2");
								next(err);
							}
						});
					});
					
				} else {
					const filename1 = path.resolve(__dirname, "../public/html_files/verify-register-wrong-hash.html");

					//NOTE: Wrong hash. don't verify the account 
					res.sendFile(filename1, function (err) {
						if(err) {
							console.log(err1);
							next(err1);
						}
					});
				}
			} else {
				console.log("Already registerd")
				res.sendFile(path.resolve(__dirname, "../public/html_files/verify-register-already-registered.html"), function (err){
					if(err) {
						console.log("err 4");
						next(err);
					}
				});
			}
		} else {
			console.log("err 5 ");
			//NOTE: User doesn't exist
			return next(new Error("User doesn't exist"));
		}
	});

	
});

module.exports = router;