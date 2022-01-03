const express =require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/', recipeController.homepage);
router.get('/categories', recipeController.exploreCtegories);
router.get('/categories/:id', recipeController.exploreCtegoriesById);
router.get('/recipe/:id', recipeController.exploreRecipe); 
router.post('/search', recipeController.searchRecipe); 
router.get('/explore-latest', recipeController.exploreLatest); 
router.get('/explore-random', recipeController.exploreRandom); 
router.get('/submit-recipe', recipeController.submitRecipe); 
router.post('/submit-recipe', recipeController.submitRecipeOnPost); 


module.exports = router;