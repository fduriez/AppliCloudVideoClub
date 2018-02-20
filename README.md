# AppliCloudVideoClub

## Introduction

The goal of this project is to transform an SQL Database into a NoSQL database in mongodb. And then to make a web application that allow you to launch some query on the new database.

---
To use this App please follow the instructions below :

__Prerequisites:__  
	npm install mongodb  
	npm install express  

__Installing__  
	need to install mongodb 3.2  

---
## Launch command below

### create folder in /data/
> If you do an error, you have to empty each of this folder before to continue

	/data/dbProjetCloud/ConfigServer/config1
	/data/dbProjetCloud/ConfigServer/config2
	/data/dbProjetCloud/sh1rs1
	/data/dbProjetCloud/sh1rs2
	/data/dbProjetCloud/sh1rs3
	/data/dbProjetCloud/sh2rs1
	/data/dbProjetCloud/sh2rs2
	/data/dbProjetCloud/sh2rs3
	/data/dbProjetCloud/sh3rs1
	/data/dbProjetCloud/sh3rs2
	/data/dbProjetCloud/sh3rs3

---
### start mongod server
    start mongod --configsvr --replSet configReplSet --port 27019 --dbpath /data/dbProjetCloud/ConfigServer/config1
    start mongod --configsvr --replSet configReplSet --port 27020 --dbpath /data/dbProjetCloud/ConfigServer/config2
    start mongod --shardsvr --replSet sh1 --port 27031 --dbpath /data/dbProjetCloud/sh1rs1
    start mongod --shardsvr --replSet sh1 --port 27032 --dbpath /data/dbProjetCloud/sh1rs2
    start mongod --shardsvr --replSet sh1 --port 27033 --dbpath /data/dbProjetCloud/sh1rs3
    start mongod --shardsvr --replSet sh2 --port 27034 --dbpath /data/dbProjetCloud/sh2rs1
    start mongod --shardsvr --replSet sh2 --port 27035 --dbpath /data/dbProjetCloud/sh2rs2
    start mongod --shardsvr --replSet sh2 --port 27036 --dbpath /data/dbProjetCloud/sh2rs3
    start mongod --shardsvr --replSet sh3 --port 27037 --dbpath /data/dbProjetCloud/sh3rs1
    start mongod --shardsvr --replSet sh3 --port 27038 --dbpath /data/dbProjetCloud/sh3rs2
    start mongod --shardsvr --replSet sh3 --port 27039 --dbpath /data/dbProjetCloud/sh3rs3

---
### start mongos
	
    start mongos --configdb configReplSet/localhost:27019 --port 27017

---
### config replicaset
> replace <PC_NAME> with the name of your PC 

    mongo --port 27019 -eval "rs.initiate();"
    mongo --port 27019 -eval "rs.add(\"<PC_NAME>:27020\");"

    mongo --port 27031 -eval "rs.initiate();"
    mongo --port 27031 -eval "rs.add(\"<PC_NAME>:27032\");rs.add(\"<PC_NAME>:27033\");

    mongo --port 27034 -eval "rs.initiate();"
    mongo --port 27034 -eval "rs.add(\"<PC_NAME>:27035\");rs.add(\"<PC_NAME>:27036\");"
	
    mongo --port 27037 -eval "rs.initiate();"
    mongo --port 27037 -eval "rs.add(\"<PC_NAME>:27038\");rs.add(\"<PC_NAME>:27039\");"
		
---
### create shards and database with sharding tag
		
    mongo --port 27017
	sh.addShard( "sh1/<PC_NAME>:27031");
	sh.addShard( "sh2/<PC_NAME>:27034");
	sh.addShard( "sh3/<PC_NAME>:27037");
	
	use ProjetCloud;
	sh.enableSharding("ProjetCloud");
	db.createCollection("Movies");
	db.Movies.createIndex({"_id":1});
	#sh.shardCollection("ProjetCloud.Movies",{"_id":1});

	db.createCollection("Customers");
	db.Customers.createIndex({"address.city":1});
	sh.shardCollection("ProjetCloud.Customers",{"address.city":1});
	
	db.createCollection("Store");
	db.Store.createIndex({"address.city":1});
	sh.shardCollection("ProjetCloud.Store",{"_id":1});
	
	db.createCollection("Rental");
	db.Rental.createIndex({"store_id":1});
	sh.shardCollection("ProjetCloud.Rental",{"store_id":1});
	
---
### run nodejs programme to import SQL database in mongodb

    node SqlToMongo.js

---
### run Application

    node application.js
Then go to [localhost](http://localhost:3000)
