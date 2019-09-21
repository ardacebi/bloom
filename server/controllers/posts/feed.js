const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');
const User = require('../../models/User/User');
const Ad = require('../../models/Ad/Ad');

module.exports = (req, res, next) => {
  const page = parseInt(req.params.page);

  User
    .findById(req.user)
    .select('user')
    .exec((err, user) => {
      if (!user) {
        return res.status(403).send({
          authenticated: false,
          error: 'Bu sayfayı görüntülemek için giriş yapmanız gerekir'
        });
      }

      Post.paginate(
        {
          author: {
            $in: user.user.following,
            $nin: user.user.blocked
          },
          anonymous: false,
          reportedBy: {$ne: req.user}
        },
        {
          sort: '-date',
          populate: 'author',
          limit: 10,
          page
        },
        (err, posts) => {
          posts = posts.docs.map(post => ({
            ...post,
            liked: post.likes.findIndex(like => like.toString() === req.user) !== -1,
            author: {
              _id: post.author._id,
              ...post.author.user
            }
          }));

          const now = new Date();
          Ad
            .find({
              startDate: { $lte: now },
              endDate: { $gte: now },
              types: 'feed'
            })
            .exec((err, ads) => {
              if (ads.length === 0) {
                return res.status(200).send({
                  authenticated: true,
                  posts,
                  ad: {}
                });
              }

              return res.status(200).send({
                authenticated: true,
                posts,
                ad: ads[0]
              });
            });
        });
    });
};
