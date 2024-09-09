const { findBy } = require('../users/users-model');

const checkIfUserExists = async (req, res, next) => {
  try {
    const [user] = await findBy({ username: req.body.username });
    if (user) {
      next({ status: 422, message: 'username taken' });
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
};

const validateRegistrationBody = (req, res, next) => {
  const { username, password } = req.body;
  const errorMessage = {
    status: 422,
    message: 'username and password required',
  };
  if (!username || !username.trim()) {
    next(errorMessage);
  } else if (!password || !password.trim()) {
    next(errorMessage);
  } else {
    next();
  }
};

module.exports = {
  checkIfUserExists,
  validateRegistrationBody,
}
