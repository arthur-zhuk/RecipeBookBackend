const Recipe = require('../models/recipes');
const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function decodeToken(token) {
  return jwt.decode(token, config.secret);
}

exports.addrecipe = function(req, res, next) {
  const recipeName = req.body.recipeName;
  let ingredients = req.body.ingredients.split(',').map(e => e.trim());

  User.findById(req.user._id, function(err, user) {
    if (err) {
     res.status(500).send(err);
    } else {
        const freshRec = new Recipe({
          recipeName: recipeName,
          ingredients: [...ingredients],
          author: user.email
        });
        console.log(user);
        console.log(freshRec);

        user.recipes.push(freshRec.id);
        user.save(function(err) {
          if (err) return next(err);
        });
        freshRec.save((err, savedRec) => {
          if (err) return next(err);
          res.json(freshRec);
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
  /*
  User.find({})
    .populate('recipes')
    .exec(function(err, results) {
      if (err) return next(err);
    })
  */
  
  User.findById(req.user._id)
    .populate('recipes')
    .exec(function(err, user) {
      if (err) return next(err);
      res.json(user);
    });
}
