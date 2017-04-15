const Recipe = require('../models/recipes');
const User = require('../models/user');
const jwt = require('jwt-simple');
//const config = require('../config');

function decodeToken(token) {
  return jwt.decode(token, process.env.SECRET);
}

exports.deleterecipe = function(req, res, next) {
  User.findOneAndUpdate(req.user._id, {$pull: {recipes: req.query.id}}, function(err, user) {
    if (err) { 
      return res.status(500).json({ 'error': 'error in deleting recipe from user' });
    }
    Recipe.findByIdAndRemove(req.query.id, function (err, recipe) {
      let response = {
        message: 'Recipe Successfully Removed',
        id: recipe._id 
      };
      console.log(recipe._id);
      res.json(recipe._id);
    })
  })
}

/*
exports.editrecipe = (req, res, next) => {
  
}
*/

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

function hideEmail(results) {
  for (let item of results) {
    let tempEmail = item.author; 
    let nameMatch = tempEmail.match(/^([^@]*)@/)[1];
    item.author = nameMatch;
  }
  return results;
}

exports.getrecipe = function(req, res, next) {
  Recipe.find(function(err, results) {
    if (err) return next(err);
    res.send(hideEmail(results));
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

