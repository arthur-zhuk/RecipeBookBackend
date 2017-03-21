const Recipe = require('../models/recipes');

exports.addrecipe = function(req, res, next) {
  const recipeName = req.body.recipeName;
  const ingredients = req.body.ingredients;

  // Recipe schema that connects to User to have recipe unique to the user???
  const freshRec = new Recipe({
    recipeName: recipeName,
    ingredients: [...ingredients]
  });

  freshRec.save((err) => {
    if (err) return next(err) 
    res.json(freshRec);
  })
}

exports.getrecipe = function(req, res, next) {
  const rec = new Recipe();
  rec.find(function(err, results) {
    if (err) return next(err);
    res.json(results);
  })
    
}
