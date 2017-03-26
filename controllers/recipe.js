const Recipe = require('../models/recipes');
const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function decodeToken(token) {
  return jwt.decode(token, config.secret);
}

exports.deleterecipe = function(req, res, next) {
  console.log('query ' + req.query.id);
  Recipe.findByIdAndRemove(req.query.id, function (err, recipe) {
    let response = {
      message: 'Recipe Successfully Removed',
      id: recipe._id 
    };
    User.findById(req.user._id, function(err, user) {
      for (let i = 0; i <= user.recipes.length; i++) {
        if (user.recipes[i] === req.query.id) {
          
        }
      }
    })
    res.send(response);
  });
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
        freshRec.save((err, savedRec) => {
          if (err) return next(err);
          user.save({recipes: user.recipes.push(savedRec._id)}, function(err) {
            if (err) return next(err);
            res.json(freshRec);
          });
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
    .populate('recipes')
    .exec(function(err, user) {
      if (err) return next(err);
      res.json(user.recipes);
    });
}
