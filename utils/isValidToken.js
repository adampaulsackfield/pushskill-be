const jwt = require('jsonwebtoken');

const isValidToken = async (token) => {
	return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) return err;
		else return decoded;
	});
};

module.exports = isValidToken;
