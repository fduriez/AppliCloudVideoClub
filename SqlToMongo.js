var mysql = require('mysql');
var mongoClient = require('mongodb').MongoClient;
var fs = require('fs');

const BDD_NAME = "ProjetCloud";
const COLLECTION_MOVIES = "Movies";
const COLLECTION_CUSTOMERS = "Customers";
const COLLECTION_RENTAL = "Rental";
const COLLECTION_STORE = "Store";
const URL_MONGO = "mongodb://localhost:27017/";

var films = new Array();
var customers = new Array();
var rentals = new Array();
var stores = new Array();

/************************/
/* Connexion BDD Sakila */
/************************/
var connection = mysql.createConnection({
	host		: 'relational.fit.cvut.cz',
	port		: '3306',
	user		: 'guest',
	password	: 'relational', 
	database	: 'sakila'
});
 
connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('connected as id ' + connection.threadId);
	
});

getMoviesData();
getCustomersData();
getRentalData();
getStoreData();

/***********************************/
/* Récupération données BDD Sakila */
/***********************************/
function getMoviesData() {
	var res = connection.query('SELECT film.film_id,title,description,release_year,language.name as language,languageOriginal.name as original_language,rental_duration,rental_rate,length,replacement_cost,rating,special_features,category.name as category,actor.first_name as actor_first_name,actor.last_name as actor_last_name,inventory.store_id as inventory  '+
										' from film'+
										' LEFT OUTER JOIN language language'+
										' ON film.language_id = language.language_id'+
										' LEFT OUTER JOIN language languageOriginal'+
										' ON film.original_language_id = languageOriginal.language_id'+
										' LEFT OUTER JOIN film_category'+
										' ON film.film_id = film_category.film_id '+
										' LEFT OUTER JOIN category'+
										' ON film_category.category_id = category.category_id'+
										' LEFT OUTER JOIN film_actor'+
										' ON film.film_id = film_actor.film_id'+
										' LEFT OUTER JOIN actor'+
										' ON film_actor.actor_id = actor.actor_id'+
										' LEFT OUTER JOIN inventory'+
										' ON film.film_id = inventory.film_id'
										);
	res
	  .on('error', function(err) {
		// Handle error, an 'end' event will be emitted after this as well
		console.log("****  ERROR QUERY !!  ****"+err);
	  })
	  .on('result', function(row) {
			var filmModel = JSON.parse(fs.readFileSync('modelsJSON/film.json', 'utf8'));
			if(!films[row.film_id]){
				filmModel._id = row.film_id;
				filmModel.title = row.title;
				filmModel.description = row.description;
				filmModel.release_year = row.release_year;
				filmModel.language = row.language;
				filmModel.original_language = row.original_language;
				filmModel.rental_duration = row.rental_duration;
				filmModel.rental_rate = row.rental_rate;
				filmModel.length = row.length;
				filmModel.replacement_cost = row.replacement_cost;
				filmModel.rating = row.rating;
				filmModel.special_features = row.special_features;
				filmModel.category.push(row.category);
				filmModel.actors.push({first_name: row.actor_first_name,last_name: row.actor_last_name});
				filmModel.inventory.push(row.inventory);
				films[row.film_id] = filmModel; 
			}else{
				if(! films[row.film_id].category.includes(row.category) )films[row.film_id].category.push(row.category);
				if(! films[row.film_id].actors.find(function(e){return e.first_name== row.actor_first_name && e.last_name == row.actor_last_name;}))
					films[row.film_id].actors.push({first_name: row.actor_first_name,last_name: row.actor_last_name});
				if(! films[row.film_id].inventory.includes(row.inventory))films[row.film_id].inventory.push(row.inventory);
			}
	  })
	  .on('end', function() {
		// all rows have been received
		insertDataInCollection(COLLECTION_MOVIES,films.slice(1));
	  });
}

function getCustomersData() {
	var i = 0;
	var res = connection.query('SELECT  *'+
										' from customer'+
										' LEFT OUTER JOIN address '+
										' ON customer.address_id = address.address_id '+
										' LEFT OUTER JOIN city '+
										' ON address.city_id = city.city_id' +
										' LEFT OUTER JOIN country '+
										' ON city.country_id = country.country_id' 
										);
	res
	  .on('error', function(err) {
		// Handle error, an 'end' event will be emitted after this as well
		console.log("****  ERROR QUERY !!  ****"+err);
	  })
	  .on('result', function(row) {
			var customerModel = JSON.parse(fs.readFileSync('modelsJSON/customer.json', 'utf8'));
			customerModel._id = row.customer_id;
			customerModel.first_name = row.first_name;
			customerModel.last_name = row.last_name;
			customerModel.email = row.email;
			customerModel.active = row.active;
			customerModel.create_date = row.create_date;
			customerModel.address = {address:row.address,address2:row.address2,district:row.district,city:row.city,country:row.country,postal_code:row.postal_code,phone:row.phone};
			customers[i] = customerModel;
			i++;
	  })
	  .on('end', function() {
		// all rows have been received
		insertDataInCollection(COLLECTION_CUSTOMERS,customers);
	  });
}


function getRentalData() {
	var i = 0;
	var res = connection.query('SELECT  *'+
										' from rental'+
										' LEFT OUTER JOIN inventory '+
										' ON rental.inventory_id = inventory.inventory_id' 
										);
	res
	  .on('error', function(err) {
		// Handle error, an 'end' event will be emitted after this as well
		console.log("****  ERROR QUERY !!  ****"+err);
	  })
	  .on('result', function(row) {
		var rentalModel = JSON.parse(fs.readFileSync('modelsJSON/rental.json', 'utf8'));

    	rentalModel._id = row.rental_id;
    	rentalModel.rental_date = row.rental_date;
    	rentalModel.customer_id = row.customer_id;
		rentalModel.film_id = row.film_id;	
    	rentalModel.return_date = row.return_date;
		rentalModel.store_id = row.store_id;
		rentals[i] = rentalModel;
		i++;
	  })
	  .on('end', function() {
		// all rows have been received
		insertDataInCollection(COLLECTION_RENTAL,rentals);
	  });
}

function getStoreData() {
	var i = 0;
	var res = connection.query('SELECT  *'+
										' from store'+
										' LEFT OUTER JOIN address '+
										' ON store.address_id = address.address_id '+
										' LEFT OUTER JOIN city '+
										' ON address.city_id = city.city_id' +
										' LEFT OUTER JOIN country '+
										' ON city.country_id = country.country_id' 
										);
	res
	  .on('error', function(err) {
		// Handle error, an 'end' event will be emitted after this as well
		console.log("****  ERROR QUERY !!  ****"+err);
	  })
	  .on('result', function(row) {
		var storeModel = JSON.parse(fs.readFileSync('modelsJSON/store.json', 'utf8'));

    	storeModel._id = row.store_id;
    	storeModel.address = {address:row.address,address2:row.address2,district:row.district,city:row.city,country:row.country,postal_code:row.postal_code,phone:row.phone};
		stores[i] = storeModel;
		i++;
	  })
	  .on('end', function() {
		// all rows have been received
		insertDataInCollection(COLLECTION_STORE,stores);
	  });
}


/*******************/
/* Insert in Mongo */
/*******************/
function insertDataInCollection(collectionName,data) {
	mongoClient.connect(URL_MONGO, function(err, db) {
		if(err) return console.log(err);
		var dbo = db.db(BDD_NAME);
	  	dbo.collection(collectionName).insertMany(data, function(err, res) {
	    	if (err) throw err;
	    	console.log(data.length + " documents inserted in " + collectionName + " collection");
	    	db.close();
		});
	});
}


/*********************/
/* Fin Connexion BDD */
/*********************/
function closeConnection() {
	connection.end(function(err) {
	 	console.log("Connection END !!");
	});
}
