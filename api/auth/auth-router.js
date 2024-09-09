const router = require('express').Router();
const { JWT_SECRET } = require('../secrets');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../users/users-model');
const {
  checkIfUserExists,
  validateRegistrationBody,
  loginCheckUsernameExists,
} = require('./auth-middleware');

router.post(
  '/register',
  validateRegistrationBody,
  checkIfUserExists,
  (req, res, next) => {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 8);
    User.add({ username, password: hash })
      .then((newUser) => {
        res.status(201).json(newUser);
      })
      .catch(next);
  }
);

router.post(
  '/login',
  validateRegistrationBody,
  loginCheckUsernameExists,
  (req, res, next) => {
    if (bcrypt.compareSync(req.body.password, req.user.password)) {
      const token = buildToken(req.user);
      res.json({
        message: `welcome, ${req.user.username}`,
        token,
      });
    } else {
      next({ status: 401, message: 'invalid credentials' });
    }
  }
);

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = router;
