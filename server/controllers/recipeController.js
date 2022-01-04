require('../models/database')
const { LEGAL_TCP_SOCKET_OPTIONS } = require('mongodb');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

 /**
  * GET /
  * Home Page
  */

 exports.homepage = async(req, res) =>{

   try {
      const limitNumber =5;
      const categories = await Category.find({}).limit(limitNumber);
      const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
      const indian = await Recipe.find({'category' : 'Indian'}).limit(limitNumber); 
      const american = await Recipe.find({'category' : 'American'}).limit(limitNumber); 
      const chinese = await Recipe.find({'category' : 'Chinese'}).limit(limitNumber); 
      const spanish = await Recipe.find({'category' : 'Spanish'}).limit(limitNumber); 
      const food = { latest, indian, american, chinese, spanish }
      res.render('index', {title : 'Cooking Blog - Home', categories,food});
   } catch (error) {
      res.status(500).send({message: error.message || "Error Occures"});
   } 
 }


 /**
  * GET /categories
  * Categories
  */

  exports.exploreCtegories = async(req, res) =>{

   try {
      const limitNumber =20;
      const categories = await Category.find({}).limit(limitNumber);
      res.render('categories', {title : 'Cooking Blog - Categories', categories});
   } catch (error) {
      res.status(500).send({message: error.message || "Error Occures"});
   }
   
 }

 /**
  * GET /categories/:id
  * Categories
  */

  exports.exploreCtegoriesById = async(req, res) =>{

   try {
      let categoryId = req.params.id;
      const limitNumber =20;
      const categoriesById = await Recipe.find({'category' : categoryId}).limit(limitNumber);
      res.render('categories', {title : 'Cooking Blog - Categories', categoriesById});
   } catch (error) {
      res.status(500).send({message: error.message || "Error Occures"});
   }
   
 }


  
/**
 * GET /recipe/:id
 * Recipe
 */

  exports.exploreRecipe = async(req, res) =>{
   try {
     let recipeId = req.params.id;
     const recipe = await Recipe.findById(recipeId);
      res.render('recipe', {title : 'Cooking Blog - Recipes', recipe});
   } catch (error) {
      res.status(500).send({message: error.message || "Error Occures"});
   }
   
 }

 
 /**
 * POST /search
 * Search Recipes
 */
  exports.searchRecipe = async(req, res) =>{
   try {
      let searchTerm = req.body.searchTerm;
      let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
      res.render('search', {title : 'Cooking Blog - Search', recipe}); 
   } catch (error) {
      res.status(500).send({message: error.message || "Error Occures"});
   }  
 }

/**
 * GET /explore-latest
 * Explore latest
 */

 exports.exploreLatest = async(req, res) =>{
   try {
      const limitNumber =20;
      const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
      res.render('explore-latest', {title : 'Cooking Blog - Explore-Latest', recipe});
   } catch (error) {
      res.status(500).send({message: error.message || "Error Occures"});
   }
   
 }

 /**
 * GET /explore-random
 * Explore Random
 */

  exports.exploreRandom = async(req, res) =>{
   try {
     let count = await Recipe.find().countDocuments();
     let random= Math.floor(Math.random()*count);
     let recipe= await Recipe.findOne().skip(random).exec();
     res.render('explore-random', {title : 'Cooking Blog - Explore-Random', recipe});
   } catch (error) {
     res.status(500).send({message: error.message || "Error Occures"});
   }
   
 }


/**
 * GET /submitRecipe
 * Submit Recipe
 */

 exports.submitRecipe = async(req, res) =>{
    const infoErrorObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit'); 
   res.render('submit-recipe', {title : 'Cooking Blog - Submit Recipe', infoErrorObj,infoSubmitObj });
 }


/**
 * POST /submitRecipeOnPost
 * 
 */

 exports.submitRecipeOnPost = async(req, res) => {
   try {
 
     let imageUploadFile;
     let uploadPath;
     let newImageName;
 
     if(!req.files || Object.keys(req.files).length === 0){
       console.log('No Files where uploaded.');
     } else {
 
       imageUploadFile = req.files.image;
       newImageName = Date.now() + imageUploadFile.name;
 
       uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
 
       imageUploadFile.mv(uploadPath, function(err){
         if(err) return res.satus(500).send(err);
       })
 
     }
 
     const newRecipe = new Recipe({
       name: req.body.name,
       description: req.body.description,
       email: req.body.email,
       ingredients: req.body.ingredients,
       category: req.body.category,
       image: newImageName
     });
     
     await newRecipe.save();
 
     req.flash('infoSubmit', 'Recipe has been added.')
     res.redirect('/submit-recipe');
   } catch (error) {
     // res.json(error);
     req.flash('infoErrors', error);
     res.redirect('/submit-recipe');
   }
 }
 

 
  /**
  * GET /
  * Contact Page
  */

   exports.contact = async(req, res) =>{

    try {
      
       res.render('contact', {title : 'Cooking Blog - Contact'});
    } catch (error) {
       res.status(500).send({message: error.message || "Error Occures"});
    } 
  }


 







  






//  async function insertDummyCategoryData(){
//     try {
//        await Category.insertMany([
//           {
//              "name": "Thai",
//              "image": "thai-food.jpg"
//           },
//           {
//             "name": "American",
//             "image": "american-food.jpg"
//          },
//          {
//             "name": "Chinese",
//             "image": "chinese-food.jpg"
//          },
//          {
//             "name": "Mexican",
//             "image": "nexiczn-food.jpg"
//          },
//          {
//             "name": "Indian",
//             "image": "indian-food.jpg"
//          },
//          {
//             "name": "Spanish",
//             "image": "spanish-food.jpg"
//          },

//        ]);
//     } catch (error) {
//        console.log('err', + error)
//     }
//  }

//  insertDummyCategoryData();