//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
// mongoose.set('useFindAndModify', false );
mongoose.connect("mongodb://localhost:27017/wikiDB"); //connect to local mongodb Server

const articleSchema = {
  title:String,
  content:String
};

const Article = mongoose.model("Article",articleSchema);


//////////////////////////////////Request Targeting all articles/////////////////////////////////////////
app.route("/articles")

.get(function(req,res){

  Article.find(function(err,foundArticles){

    if(err){
      res.send(err);
    }else{
      res.send(foundArticles);
    }

  });

})

.post(function(req,res){

  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });

  newArticle.save(function(err){

    if(!err){
      res.send("Successfully added a new article.");
    }else{
      res.send (err);
    }

  });

})

.delete(function(req,res){

  Article.deleteMany(function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Successfully delete all the articles.");
    }
  });
});


//////////////////////////////////Request Targeting specific articles/////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){

  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(err){
      res.send(err);
    }else{

      if(foundArticle){
        res.send(foundArticle);
      }else{
        res.send("Sorry, no articles mathcing that title was found.");
      }

    }
  });

})

.put(function(req,res){

  Article.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwite:true},//with overwite equal to true, if user only update one key (example:update title but without update content), then the new data will only contains title
    function(err){
      if(!err){
        res.send("Successfully updated article");
      }else{
        res.send(err);  //to make it more complete: check whether the article exists first then only update, if no send a message to tell the user
      }
    }

  );
})

.patch(function(req,res){

  Article.updateOne(
    {title:req.params.articleTitle},
    {$set: req.body},//req.body contains object (example:{title:"",content:""}, so $set will only update the key that user has provided)
    function(err){
      if(err){
        res.send(err);
      }else{
        res.send("Successfully updated article");
      }
    }
  );
})

.delete(function(req,res){

  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(err){
        res.send(err);
      }else{
        res.send("Successfully deleted the selected article");
      }
    }
  );
}); 

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
