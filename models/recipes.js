const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  recipeName: String,
  ingredients: [String],
  date: { type: Date, default: Date.now }
});

const RecipeModelClass = mongoose.model('recipe', recipeSchema);

module.exports = RecipeModelClass;
