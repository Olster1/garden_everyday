var express = require('express')
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const constants = require('../utils/constants');
const { checkToken, checkNoToken } = require('../utils/auth');
const path = require('path');
const crypto = require('crypto'); 
const sgMail = require('@sendgrid/mail')

const userModel = require(path.resolve(__dirname, '../models/users.js'));
const userSetModel = require(path.resolve(__dirname, '../models/user_settings.js'));

var router = express.Router();


function initUserSession(httpRes, documentResult) {
	//CREATE TOKEN
	let token = jwt.sign({userId: documentResult._id}, process.env.MY_SECRET_KEY, { expiresIn: '24h'} );

	//STICK IT IN A COOKIE
	httpRes.cookie('jwt_token', token, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: true});

	console.log("sendign result");

	//SEND BACK THE RESULT
	httpRes.json({
		result: constants.SUCCESS,
		data: {
			isLoggedIn: true,
			email: documentResult.email,
			name: documentResult.name,
			userSetup: documentResult.setUpProfile,
			_id: documentResult._id
		},
		message: 'you succesfully logged in',
	});
}


router.post('/logout', checkToken, (req, res) => {
	//delete cookie
	res.cookie('jwt_token', {}, {maxAge: 0, httpOnly: true, secure: false, overwrite: true});

	res.json({
		result: constants.SUCCESS,
		data: {},
		message: "you logged out"
	});
});



router.post('/login', checkNoToken, (req, httpRes, next) => {
	const email = req.body.email;
	const password = req.body.password;

	userModel.find({ email: email }, (err, documentResult) => {
		if(err) {
			console.log("an error");
			//NOTE(ollie): go to the express middleware to handle error
			return next(err);
		}

		if(documentResult.length > 0) {
			//NOTE(ol): user exists

			console.log(documentResult[0]);

			const documentPassword = documentResult[0].password;

			//NOTE: Was added to the db before introduced
			const verificationDefined = !(typeof documentResult[0].accountVerified === 'undefined');

			if(!verificationDefined || documentResult[0].accountVerified === true) {

				if(!verificationDefined) {
					//NOTE: UPdate record to have the value
					userModel.updateOne({ _id: documentResult[0]._id }, { accountVerified: true }, (err2, documentResult) => {
						if(err2) {
							return next(err2);
						}
					});
				}

				bcrypt.compare(password, documentPassword, function(encryptError, res) {
				    if(encryptError) {
				    	httpRes.status(501).json(
				    	{
	    					result: constants.ERROR,
	    					data: {},
	    					message: 'couldn\'t encrypt',
	    				});
				    } else if(res == true) {
				    	initUserSession(httpRes, documentResult[0]);
				    } else {
				    	//DELETE TOKEN COOKIE
				    	httpRes.cookie('jwt_token', {}, {maxAge: 0, httpOnly: true, secure: false, overwrite: true});
			    		
				    	//SEND BACK RESULT
			    		httpRes.json({
			    			result: constants.FAILED,
							data: {},
							message: 'password was wrong',
			    		});
				    }
				});
			} else {
				httpRes.json({
					result: constants.FAILED,
					data: {},
					message: 'Please verify your account from the email sent to you. <a href=\"\">Click Here if you need to send a new email.</a>',
				});
			}
		} else {
			


			//NOTE(ol): Username doesn't exist
			httpRes.json({
				result: constants.FAILED,
				data: {},
				message: 'username doesn\'t exist',
			});
		}
	});
});

router.post('/register', checkNoToken, (req, httpRes, next) => {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	userModel.find({ email: email }, (err, documentResult) => {
		if(err) {
			console.log("error 1");
			//NOTE(ollie): go to the express middleware to handle error
			return next(err);
		}

		if(documentResult.length == 0) {
			//NOTE(ol): No one has taken this username

			//NOTE: Build a hash for the verification code
			let current_date = (new Date()).valueOf().toString();
			let random = Math.random().toString();
			let verificationHash = crypto.createHash('sha1').update(current_date + random).digest('hex');
			/////////////////////////////////
				
			//NOTE: Build url for the verification page
			const verificationUrl = 'https://' + req.headers.host + '/verify-register/' + email + '/' + verificationHash;

			/////////////////////////////////////////////////////

			const msg = {
			  to: email, // Change to your recipient
			  from: 'ollietheexplorer@gmail.com', // Change to your verified sender
			  subject: 'Verify your Goals Everyday Account',
			  html: "Hi " + name + "! Thank you for registering with Goals Everyday! To verify your account please <a href='" + verificationUrl + "'>click here<a>.\n I this doesn't work copy and paste this address: " + verificationUrl
			}

			sgMail
			  .send(msg)
			  .then((response) => {
			    console.log(response[0].statusCode)
			    console.log(response[0].headers)
			  })
			  .catch((error) => {
			    return next(error);
			  })

			////////////////////////////////////////////////////////////


			const newUser = new userModel({
				name: name,
				password: password,
				email: email,
				verificationHash: verificationHash, 
				accountVerified: false,
				setUpProfile: false
			});

			newUser.save((err2, result) => {
				if(err2) {
					console.log("error 1");
					//NOTE(ollie): go to the express middleware to handle error
					return next(err2);
				}

				console.log(result);
				console.log("new user id is: " + result._id);

				//NOTE: Don't init user session since they have to verify their account first.
				// initUserSession(httpRes, result);

				//NOTE: Default settings
				const userSet = new userSetModel({
					climateRegion: "DEFAULT",
					latitude: 0,
					longitude: 0,
					plantIds: [],
					ownerId: result._id,
					gpsSet: false
				});

				userSetModel.findOne({ ownerId: result._id }, (err, documentResult) => {
					if(err) {
						return next(err);
					}
					if(documentResult == null) { //found the settings

						userSet.save((err3, result) => {
							if(err3) {
								httpRes.json({
									result: constants.ERROR,
									data: {},
									message: 'error saving',
								});
							} else {
								httpRes.json({
					    			result: constants.SUCCESS,
									data: {},
									message: 'Account succesfully registered.',
					    		});
							}
						});
					} else {
						httpRes.json({
			    			result: constants.ERROR,
							data: {},
							message: 'User Settings Already Exist. Something went wrong.',
			    		});
					}
				});

			});


		} else {
			//NOTE(ol): Username is taken already
			httpRes.json({
    			result: constants.FAILED,
				data: {},
				message: 'Username is already taken',
    		});
		}
	});
});


// define the home page route
router.post('/isLoggedIn', checkToken, (req, httpRes) => {
	userModel.findOne({_id: req.userId}, (error, doc) => {
		if(error) {
			return next(error);
		} else {
			
			if(doc === null) {
				return httpRes.json({
					result: constants.FAILED,
					data: {},
					message: 'You account doesnt exist' 
				});
			} else {
				initUserSession(httpRes, doc);

			}
			
		}
	});

	
});

module.exports = router;