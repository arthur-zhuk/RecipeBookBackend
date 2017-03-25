const Authentication = require('./controllers/authentication');
const RecipeMethods = require('./controllers/recipe');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.post('/signin', requireSignIn, Authentication.signin);
  app.post('/signup', Authentication.signup);
  app.post('/postrecipe', requireAuth, RecipeMethods.addrecipe);
  app.get('/allrecipes', RecipeMethods.getrecipe);
  app.get('/my_recipes', requireAuth, RecipeMethods.getcurrentuserrecipes);
};

