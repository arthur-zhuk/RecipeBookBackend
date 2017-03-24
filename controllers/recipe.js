const Recipe = require('../models/recipes');
const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function decodeToken(token) {
  return jwt.decode(token, config.secret);
}

exports.addrecipe = function(req, res, next) {
  const recipeName = req.body.recipeName;
  let ingredients = req.body.ingredients.split(',');
    ingredients = ingredients.map(e => e.trim());
  const authorId = decodeToken(req.headers.authorization);

  // Recipe schema that connects to User to have recipe unique to the user???
  User.findOne(req.user._id, function(err, user) {
    console.log(user);
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
      });

      //user.recipes.push({recipeName: recipeName, ingredients: [...ingredients]});

      user.save((err, updatedUser) => {
        if (err) return next(err);
        res.json(updatedUser);
      });
    }
  });
}

exports.getrecipe = function(req, res, next) {
  Recipe.find(function(err, results) {
    if (err) return next(err);
    res.send(results);
  })
}

exports.getcurrentuserrecipes = function(req, res, next) {
  User.findById(req.user._id)
    .populate("recipes")
    .exec(function(err, results) {
    if (err) return next(err);
    res.send(results.recipes);
  })
}
