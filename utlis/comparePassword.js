const bcrypt = require('bcryptjs');
const comparePassword = async (candidatePassword, password) => {
	return bcrypt.compare(candidatePassword, password);
};
module.exports = comparePassword;
