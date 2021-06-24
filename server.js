const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const mongoose = require('mongoose');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt  = require('bcrypt');

const sgMail = require('@sendgrid/mail')

const { checkToken } = require('./utils/auth.js')

//////////////////////

//NOTE(ol): global path like .exe path in game programming
const path = require('path');
//

const app = express();

app.use(cors());

if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	const result = require('dotenv').config();
	// console.log(result);
} 

///////////////////////************ ROUTERS *************////////////////////

const userRouter = require(path.resolve(__dirname, 'routes/user.js'))
const goalRouter = require(path.resolve(__dirname, 'routes/goal.js'))
const plantRouter = require(path.resolve(__dirname, 'routes/plant.js'))
const userSettingsRouter = require(path.resolve(__dirname, 'routes/user_settings.js'))
const verifyRegisterRouter = require(path.resolve(__dirname, 'routes/verify-register.js'))

 
////////////////////////////////////////////////////////////////////

// const userModel = require(path.resolve(__dirname, 'models/users.js'));
// const goalModel = require(path.resolve(__dirname, 'models/goals.js'));
// const plantModel = require(path.resolve(__dirname, 'models/plant.js'));
// const userSettingsModel = require(path.resolve(__dirname, 'models/user_settings.js'));

//NOTE: For Node Mailer

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

////////////// APP INITIED //////////////////

//Logger middleware
app.use(morgan('dev'));

//json paser middleware
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//NOTE(ol): make static files public
//NOTE(ol): This is a middleware that serves up files
//look in the app folder
const staticPath = path.resolve(__dirname, "./public/"); //this is so the filenames are handled for linux & windows convention
app.use(express.static(staticPath));


const PORT = process.env.PORT || 8080;

//DB connect
mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }).catch((error) => {
	console.log(error);
	console.log("couldn't connect to database");
});

///////

///////////////////////*********** Assign routers **************////////////////////

app.use('/user', userRouter);
app.use('/goal', goalRouter);
app.use('/userGardenSettings', userSettingsRouter);
app.use('/plant', plantRouter);


////////////////////////////// error handlers for the POST routes //////////////////////////////////////

/*
How Middle Ware works

*/

app.use((error, req, res, next) => {
	console.log("HEY! SERVER ERROR");
	console.log(error);
	res.status(500).json({
		result: 'ERROR',
		data: {},
		message: "something went wrong"
	});
});

////////////////////////////////////////////////////////////////////


app.post('/build_numerology_pdf', (req, res, next) => {

	// const mailOptions = {
	//   from: 'ollietheexplorer@gmail.com',
	//   to: req.body.emailTo,
	//   subject: 'Sending Email using Node.js',
	//   text: '<h1>This is the header</h1><p>This is the body</p>',
	//   attachments: [{
	//     filename: 'unique_numerology.pdf',
	//     path: 'C:/Users/olive/Desktop/oliver_immunisation.pdf',
	//     contentType: 'application/pdf'
	//   }]
	// };


	
});


app.post('/add_to_email_list', (req, res, next) => {
    res.json({
		result: 'SUCCESS',
		data: {},
		message: "Sent Mail to " + req.body.emailTo
	});
});



// app.post('/getSecretMessage', checkToken, (req, res, next) => {
// 	//NOTE(ol): Has gone through our middleware so token is valid
// 	console.log("USERNAME: " + req.email);

// 	res.json({
// 		successful: true,
// 		reason: 'got message',
// 		message: 'Priates are attacking NOW!'
// 	});
// });


app.post('/addTodo', (req, res, next) => {
	//NOTE(ol): doing it using save, we run mongooses prehooks listed in save 
	const newTodo = new listModel({
		completed: false,
		name: req.body.name,
		description: req.body.description,
	});


	newTodo.save((error, result) => {
		console.log(result);
		console.log("result");
		if(error) {
			return next(error);
		}

		res.json(result);
	});
});

app.post('/alterTodo', (req, res, next) => {
	const id = req.body.id;

	const value = req.body.value;

	listModel.updateOne({_id: id}, { $set: { completed: value } }, {multi: false}, (error, result) => {
		if(error) {
			return next(error);
		}
		console.log(result);

		res.json({
			success: true
		});
	});
});


app.use('/verify-register', verifyRegisterRouter);

//Handle all other request

app.get('/*', (req, res, next) => {
	console.log(req.hostname);

	if(req._parsedOriginalUrl.pathname == "/") {
		res.sendFile(path.resolve(__dirname, "./public/html_files/index.html"));
	} else {

		let extension = path.extname(req._parsedOriginalUrl.pathname);

		
		if(extension === "") {
			extension = ".html";
		} else {
			extension = "";
		}


		//NOTE: Everything relative to the file name
		const filename = "./public/html_files" + req._parsedOriginalUrl.pathname + extension;
		
		res.sendFile(path.resolve(__dirname, filename), function (err){
			if(err) {
				return next(err);
			}
		});
	}
});


app.use((error, req, res, next) => {
	console.log("HEY! 404 ERROR");
    res.status(404).sendFile(path.resolve(__dirname, "./public/html_files/404.html"));
});




app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
