const Authentication = require('./controllers/authentication');
const RecipeMethods = require('./controllers/recipe');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'Super Secret Code is abc123' });
  });
  app.post('/signin', requireSignIn, Authentication.signin);
  app.post('/signup', Authentication.signup);
  app.post('/postrecipe', /*requireSignIn,*/ RecipeMethods.addrecipe);
  app.get('/allrecipes', function(req, res) {
    const list = RecipeMethods.getRecipes;
    res.send(list); 
  });
};

