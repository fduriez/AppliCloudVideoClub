var express = require('express');
var queries = require("./queries.js");

var app = express();
app.use(express.static('public'));


/*****************/
/* Queries Users */
/*****************/

/****** get movies by title *****************/
app.get('/getFilmsByTitle', function(req, res) {
    res.setHeader('Content-Type', 'text/json');
	queries.getFilmsByTitle(req.query.title,req.query.storeID==null?null:parseInt(req.query.storeID),function(results){
		  console.log(results);
		  res.end(JSON.stringify(results));
	});
});


/****** get movies by category *****************/
app.get('/getFilmsByCategory', function(req, res) {
    res.setHeader('Content-Type', 'text/json');
	queries.getFilmsByCategory(req.query.category,req.query.storeID==null?null:parseInt(req.query.storeID),function(results){
		  console.log(results);
		  res.end(JSON.stringify(results));
	});
});


/****** get movies by Actor *****************/
app.get('/getFilmsByActor', function(req, res) {
    res.setHeader('Content-Type', 'text/json');
	queries.getFilmsByActor(req.query.name,req.query.storeID==null?null:parseInt(req.query.storeID),function(results){
		  console.log(results);
		  res.end(JSON.stringify(results));
	});
});

/****** get TOP movies by month *****************/
app.get('/getTopFilmsByMonth', function(req, res) {
    res.setHeader('Content-Type', 'text/json');
	queries.getTopFilmsByMonth(req.query.date,req.query.storeID==null?null:parseInt(req.query.storeID),function(results){
		  console.log(results);
		  res.end(JSON.stringify(results));
	});
});



/*******************/
/* Queries Analyst */
/*******************/
/****** get number of rental by category *****************/
app.get('/getNbRentalByDate', function(req, res) {
    res.setHeader('Content-Type', 'text/json');
	queries.getNbRentalByDate(parseInt(req.query.month),parseInt(req.query.year),function(results){
		  console.log(results);
		  res.end(JSON.stringify(results));
	});
});


/****** get TOP movies by month *****************/
app.get('/getNbRentalBycategory', function(req, res) {
    res.setHeader('Content-Type', 'text/json');
	queries.getNbRentalBycategory(req.query.storeID,function(results){
		  console.log(results);
		  res.end(JSON.stringify(results));
	});
});

/****** get All stores informations *****************/
app.get('/getAllStores', function(req, res) {
    res.setHeader('Content-Type', 'text/json');
	queries.getAllStores(function(results){
		  console.log(results);
		  res.end(JSON.stringify(results));
	});
});

app.get('/getAllCategories', function(req, res) {
    res.setHeader('Content-Type', 'text/json');
	queries.getAllCategories(function(results){
		  console.log(results);
		  res.end(JSON.stringify(results));
	});
});

/*************************/
/* Queries Administrator */
/*************************/

app.get('/getInfosCluster', function(req, res) {
    res.setHeader('Content-Type', 'text/json');
	queries.getInfosCluster(function(results){
		  console.log(results);
		  res.end(JSON.stringify(results));
	});
});



app.listen(3000);