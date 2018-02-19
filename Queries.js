var MongoClient = require('mongodb').MongoClient;

const BDD_NAME = "ProjetCloud";
const COLLECTION_MOVIES = "Movies";
const COLLECTION_CUSTOMERS = "Customers";
const COLLECTION_RENTAL = "Rental";
const COLLECTION_STORE = "Store";
const URL_MONGO = "mongodb://localhost:27017/";


/************************/
/* Variables Dynamiques */
/************************/
var storeID = 1;
var date = new Date('2005-06-17');
var firstName = "PENELOPE";
var lastName = "GUINESS";
var category = "Documentary";
var month = 4;
var year = 2005;

/*
getNbRentalBycategory(storeID,function(results){
	console.log(results);
});
*/

/*
getTopFilmsByMonth(date,function(results){
	console.log(results);
});
*/

/*
getFilmsByActor(firstName, lastName,function(results){
	console.log(results);
});
*/

/*
getFilmsByCategory(category,function(results){
	console.log(results);
});
*/

/*
getNbRentalByDate(month,year,function(results){
	console.log(results);
});
*/

/*****************/
/* Queries Users */
/*****************/
exports.getFilmsByTitle = function(title,storeID, callback) {
	var fields = {};
	var opMatch = {$match: {"title" : {$regex : title, $options:"i"}}};
	var opUnwind = {$unwind: "$inventory"};
	var opMatch2 = {$match: {"inventory" : storeID}};
	var aggregate;
	if(storeID == null) aggregate = [opMatch];
	else aggregate = [opMatch,opUnwind,opMatch2];

	launchQuery(COLLECTION_MOVIES,"aggregate",aggregate,fields,function(results){
		callback(results);
	});
}


exports.getFilmsByCategory = function (category,storeID, callback) {
	var fields = {};
	var opUnwind = {$unwind: "$category"};
	var opMatch = {$match: {"category" : category}};
	var opUnwind2 = {$unwind: "$inventory"};
	var opMatch2 = {$match: {"inventory" : storeID}};
	var aggregate;
	if(storeID == null) aggregate = [opUnwind,opMatch];
	else aggregate = [opUnwind,opMatch,opUnwind2,opMatch2];
	
	console.log(aggregate);
	launchQuery(COLLECTION_MOVIES,"aggregate",aggregate,fields,function(results){
		callback(results);
	});
}
exports.getFilmsByActor = function (name,storeID, callback) {
	var fields = {};
	var opUnwind = {$unwind: "$actors"};
	var opMatch = {$match: {$or: [ {"actors.first_name": {$regex: name,$options: "i"}}, {"actors.last_name": {$regex: name,$options: "i"}}]}};
	console.log(opMatch);
	var opMatch2 = {$match: {"inventory" : storeID}};
	var aggregate;
	if(storeID == null) aggregate = [opUnwind,opMatch];
	else aggregate = [opUnwind,opMatch,opMatch2]
	launchQuery(COLLECTION_MOVIES,"aggregate",aggregate,fields,function(results){
		callback(results);
	});
}

exports.getTopFilmsByMonth = function(date,storeID,callback) { 
	var beginDate = new Date(date);
	beginDate.setMonth(beginDate.getMonth() - 1);
	console.log("begin Date : " + beginDate.toISOString());
	var endDate = new Date(date);
	console.log("end Date : " + endDate.toISOString());

	var fields = {};
	var opMatch = {$match : {store_id : storeID}};
	var opMatch2 = {$match : {rental_date : { "$gte": beginDate, "$lte": endDate}}};
	var opGroup = {$group : {_id: "$film_id", "tot": {$sum: 1}}};
	var opSort = {$sort: {"tot": -1}};
	var opLimit = {$limit : 10};
	var opLookup = {$lookup : {"from" : "Movies", "localField" : "_id",
						"foreignField" : "_id","as" : "movie"}};
	var opUnwind = {$unwind: "$movie"}		

	var aggregate = [opMatch,opMatch2,opGroup,opSort,opLimit,opLookup,opUnwind];
	if (storeID == null) aggregate = [opMatch2,opGroup,opSort,opLimit,opLookup,opUnwind];

	console.log("START");
	launchQuery(COLLECTION_RENTAL,"aggregate",aggregate,fields,function(results){
		callback(results);
	});
}

/*******************/
/* Queries Analyst */
/*******************/
exports.getNbRentalByDate = function (month,year,callback) {
	var beginDate = new Date();
	beginDate.setDate(1);
	beginDate.setMonth(month);
	beginDate.setFullYear(year);
	var endDate = new Date();
	endDate.setDate(28);
	if(month != 1) endDate.setDate(endDate.getDate() + 2);
	if(month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) endDate.setDate(endDate.getDate() + 1);
	endDate.setMonth(month);
	endDate.setFullYear(year);
	
	console.log("beginDate : " + beginDate);
	console.log("endDate : " + endDate);

	var fields = {};
	var opMatch = {$match : { rental_date : { "$gte": beginDate, "$lte": endDate}}};
	var opGroup = {$group : {_id: month +"/" + year, "tot": {$sum: 1}}};

	console.log("START");
	launchQuery(COLLECTION_RENTAL,"aggregate",[opMatch,opGroup],fields,function(results){
		callback(results);
	});
}

exports.getNbRentalBycategory = function (storeID,callback) {
	var fields = {};
	var opMatch = {$match : {"store_id" : parseInt(storeID,10)}};
	var opLookup = {$lookup : {"from" : "Movies", "localField" : "film_id",
							"foreignField" : "_id","as" : "movie"}};
	var opUnwind = {$unwind: "$movie"};
	var opUnwind1 = {$unwind: "$movie.category"};
	var opGroup = {$group : {_id: "$movie.category", "tot": {$sum: 1}}};
	var opOrder = {$sort: {"tot": -1}};
	var aggregate = [opMatch,opLookup,opUnwind,opUnwind1,opGroup,opOrder];
	if(storeID == null) 
		aggregate = [opLookup,opUnwind,opUnwind1,opGroup,opOrder];
	console.log(aggregate);
	launchQuery(COLLECTION_RENTAL,"aggregate",aggregate,fields,function(results){
		callback(results);
	});
}

exports.getAllStores = function (callback) {
	var fields = {};
	var opMatch = {};
	launchQuery(COLLECTION_STORE,"find",opMatch,fields,function(results){
		callback(results);
	});
}

exports.getAllCategories = function (callback) {
	var fields = {};
	var opUnwind = {$unwind: "$category"};
	var opGroup = {$group: {"_id":"$category"}}
	launchQuery(COLLECTION_MOVIES,"aggregate",[opUnwind,opGroup],fields,function(results){
		callback(results);
	});
}


/*************************/
/* Queries Administrator */
/*************************/

exports.getInfosCluster = function(callback){
MongoClient.connect(URL_MONGO, function(err, db) {
		if (err) throw err;
		var dbo = db.db(BDD_NAME);
		dbo.stats(function(err, res){
			console.log(res);
			callback(res);
		});
	});
}



/***************************/
/* Launch a Query to Mongo */
/***************************/
function launchQuery(collection,typeQuery,query,fields,callback) {
	MongoClient.connect(URL_MONGO, function(err, db) {
		if (err) throw err;
		
		var dbo = db.db(BDD_NAME);
		//console.log(query);
		if(typeQuery == "find")
			dbo.collection(collection).find(query,fields).toArray(function(err, result) {
				if (err) throw err;
				callback(result);
				db.close();
			});

		if( typeQuery == "aggregate")
			dbo.collection(collection).aggregate(query).toArray(function(err, result) {
					if (err) throw err;
					callback(result);
					db.close();
		});
	});
}