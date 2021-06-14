const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');

module.exports.checkToken = function(req, res, next) {
	const token = req.cookies.jwt_token;

	if (token) {
        jwt.verify(token, process.env.MY_SECRET_KEY, (err, decoded) => {
        	if(err) {
        		return res.status(403).json({
        			result: constants.ERROR,
        			data: {},
        			message: 'there was an error verifying your login' 
        		});
        	} else {
        		console.log("decoded is ");
                console.log(decoded);
        		req.userId = decoded.userId;
                console.log(req.userId);
                console.log(decoded.userId);
        		return next();
        	}
   		});
	} else {
		return res.json({
			result: constants.FAILED,
			data: {},
			message: 'You are not logged in' 
		});
	}
}

module.exports.checkNoToken = function(req, res, next) {
    const token = req.cookies.jwt_token;

    if (token) {
        jwt.verify(token, process.env.MY_SECRET_KEY, (err, decoded) => {
            if(err) {
                return res.status(403).json({
                    result: constants.ERROR,
                    data: {},
                    message: 'there was an error verifying your login' 
                });
            } else {
               return res.json({
                   result: constants.FAILED,
                   data: {},
                   message: 'You are logged in' 
               });
            }
        });
    } else {
        return next();
    }
}