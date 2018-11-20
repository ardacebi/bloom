const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.user) {
    res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir kişi seçtiğinizden emin olun'
    });
  }

  User
    .findById(req.params.user)
    .select('user')
    .exec((err, user) => {
      if (!user) {
        return res.status(422).send({
          authenticated: true, 
          error: 'Böyle bir kullanıcı yok'
        });
      }

      Post
        .find({
          author: req.params.user,
          anonymous: false
        })
        .sort('-date')
        .exec((err, posts) => {
          res.status(200).send({
            authenticated: true,
            user: {
              id: user.id,
              ...user._doc.user,
              posts: posts.map(post => ({
                id: post.id,
                ...post._doc,
                liked: post.likes.indexOf(req.user) !== -1
              }))
            }
          });
        });
    });
};