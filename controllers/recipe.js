const Recipe = require('../models/recipes');
const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function decodeToken(token) {
  return jwt.decode(token, config.secret);
}

exports.addrecipe = function(req, res, next) {

  const recipeName = req.body.recipeName;
  const ingredients = req.body.ingredients;
  const authorId = decodeToken(req.headers.authorization);
  console.log(authorId.sub);

  // Recipe schema that connects to User to have recipe unique to the user???

  User.findById(authorId.sub, function(err, user) {
    if (err) {
      res.status(500).send(err);
    } else {
      const freshRec = new Recipe({
        recipeName: recipeName,
        ingredients: [...ingredients],
        author: user.email
      });

      freshRec.save((err) => {
        if (err) return next(err) 
        res.json(freshRec);
      })
    }
  });
}

exports.getrecipe = function(req, res, next) {
  Recipe.find(function(err, results) {
    if (err) return next(err);
    res.send(results);
  })
}
