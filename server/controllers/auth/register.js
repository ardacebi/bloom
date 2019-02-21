const mongoose = require('mongoose');
const User = require('../../models/User/User');

const jwt = require('jsonwebtoken');

const trim = str => str.replace(/\s+/g,' ').trim();

module.exports = (req, res, next) => {
  if (
    !req.body ||
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.school ||
    !req.body.email ||
    !req.body.password ||
    !req.body.password2
  ) {
    return res.status(422).send({
      authenticated: false,
      error: 'Lütfen tüm boşlukları doldurun'
    });
  }

  if (req.body.password !== req.body.password2) {
    return res.status(422).send({
      authenticated: false,
      error: 'Lütfen girdiğiniz şifrelerin eşleştiğinden emin olun'
    });
  }

  req.body.firstName = trim(req.body.firstName);
  req.body.lastName = trim(req.body.lastName);

  User
    .findOne({'auth.email': req.body.email})
    .exec((err, userRes) => {
      if (userRes) {
        return res.status(422).send({
          authenticated: false,
          error: 'Bu e-mail ile kayıtlı bir hesap zaten var'
        });
      }

      const newUser = new User({
        auth: {
          email: req.body.email,
          password: req.body.password
        },
        user: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          school: req.body.school,
        }
      });
      newUser.save(err => {
        const token = jwt.sign({user: newUser.id}, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24 * 365 * 10 // 10 years
        });

        res.status(200).send({
          authenticated: true,
          jwt: token
        });
      });
    });
};
