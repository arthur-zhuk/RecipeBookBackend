const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');

const recipeSchema = new Schema({
  recipeName: String,
  ingredients: [String],
  steps: String,
  author: { type: String, ref: 'User' },
  date: { type: Date, default: Date.now }
});

const ModelClass = mongoose.model('Recipe', recipeSchema);

module.exports = ModelClass;
