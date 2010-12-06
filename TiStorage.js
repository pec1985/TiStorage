/**
 * A lightweight document storage library.
 * Use this library to quickly build data sets inside the
 * Titanium Properties API.  This is perfect if you don't need to
 * use a SQL database but need to store data.
 *
 * NOTE: THIS IS A DRAFT VERSION
 *
 * Loosly inspired by: 
 * Customer tickets, Lawnchair, MongoDB, and 
 * http://developer.appcelerator.com/blog/2010/06/how-to-persist-complex-javascript-objects.html
 *
 * @author      Rick Blalock
 * @company		Appcelerator
 *
 *
 	SAMPLE USAGE
	
	Select a 'database'.  If one is present in the PropertiesDB, it will be created
	-------------------------------------------------------------------------------
	var conn = TiStorage();
	var db = conn.use('appc');


	Will select an object collection called 'users'.  If it doesn't exist
	it will be created automatically.
	-------------------------------------------------------------------------------
	var users = db.collection('users');


	Get all records in the users object
	-------------------------------------------------------------------------------
	var allUsers = users.find();
	
	
	Creates a new record in the selected collection
	-------------------------------------------------------------------------------
	users.create({ 
		'first_name': 'Rick',
		'last_name': 'Blalock'
	});


	Filters a record set with the name 'Rick'
	-------------------------------------------------------------------------------
	var getUser = users.find({'first_name': 'Rick'});


	Updates specific record with passed data object
	-------------------------------------------------------------------------------
	users.update(getUser.id, { 
		'sport': 'Soccer'
	});


	Removes record
	-------------------------------------------------------------------------------
	users.remove(getUser.id);

 */	
var TiStorage = function() {
	return new TiStorage.core();
};

TiStorage.core = TiStorage.prototype = function() {
	// A default name the Ti Properties API will use (most likely will never need to change)
	this.globalStore = 'StorageDb';  
	// The global database name
	this.database = null;	
	// the global collection selected for this instance
	this.collection = null; 
	// Global Ti property exposed
	this.storage = JSON.parse(Ti.App.Properties.getString(this.globalStore));	
	
	// If there's no globalStore property yet, make one
	if(this.storage == null) {
		// Start the empty global object and save it to Ti properties
		var StorageDb = {}; 
		var storage = Ti.App.Properties.setString(this.globalStore, JSON.stringify(StorageDb));

		this.storage = JSON.parse(Ti.App.Properties.getString(this.globalStore));
	}
	
	/**
	 * Selects the database for this instance.  If
	 * it doesn't exist, creates a new one and then selects
	 *
	 * @param (string) db Name of the database to select / create
	 */	
	this.use = function(db) {	
		if(this.storage[db] == null) {
			this.storage[db] = {};
			Ti.App.Properties.setString(this.globalStore, JSON.stringify(this.storage));
		}

		this.database = db;

		return this;
	};

	/**
	 * Selects the collection from the db instance.  If
	 * it doesn't exist, creates a new one and then selects
	 *
	 * @param (string) collection Name of the collection to select / create
	 */	
	this.collection = function(collection) { 
		if(this.storage[this.database][collection] == null) {			
			this.storage[this.database][collection] = [];
			Ti.App.Properties.setString(this.globalStore, JSON.stringify(this.storage));
		}
		
		this.collection = collection;
		
		return this;		
	};
	
	/**
	 * Create a new record / data in the selected collection
	 *
	 * @param (object) obj An object of props/values for the new record
	 */
	this.create = function(obj) {
		// Get the last index and the id prop.
		var coll = this.storage[this.database][this.collection];
		last = coll[coll.length - 1];
		
		// Create a new id (not perfect)
		obj.id = last ? last.id + 1 : 0;
		
		this.storage[this.database][this.collection].push(obj);
		Ti.App.Properties.setString(this.globalStore, JSON.stringify(this.storage));
		
		return this;
	};
	
	/**
	 * Updates an existing row / data in the selected collection
	 *
	 * @param (integer) index The index of the record
	 * @param (object) obj An object of props/values for to update
	 */
	this.update = function(index, obj) {
		var record = this.storage[this.database][this.collection][index];
		
		for(prop in obj) {
			// If prop doesn't exist, create it (prop as string in MongoDB fashion)
			if(record[prop] === undefined) {
				record['\'' + prop + '\''] = obj[prop];
			} else {
				record[prop] = obj[prop];
			}
		}
		
		Ti.App.Properties.setString(this.globalStore, JSON.stringify(this.storage));
		
		return this;
	};
	
	/**
	 * Removes one specified row / data in the selected collection
	 *
	 * @param (integer) itemId The item ID property of the record
	 */
	this.remove = function(itemId) {
		// @TODO Determine whether to remove by ID or by associative object
		// Make sure we're dealing with the right collection
		var collection = this.storage[this.database][this.collection];
		
		// Get the row to remove by ID reference
		var row = this.findOne({ id: itemId });

		// Splice out the array index of the row
		collection.splice(collection.indexOf(row), 1);

		// Save the collection minus the removed row above
		Ti.App.Properties.setString(this.globalStore, JSON.stringify(this.storage));

		return this;
	};
	
	/**
	 * Wrapper method to narrow search to only one record
	 *
	 * @param (object) obj The object to filter by
	 */	
	this.findOne = function(obj) {
		return this.find(obj, 'true');
	};
	
	/**
	 * Find a record by the criteria provided
	 *
	 * @param (object) obj The object criteria to filter by
	 * @param (bool) qty Whether to filter for one result or return all matching
	 */	
	this.find = function(obj, qty) {
		var collection = this.storage[this.database][this.collection];
		
		if(obj === undefined) {
			return collection; // return the whole collection object
		} else {
			// Cache the record array
			var record = [];
			
			// Loop through all collection records (the big mess begins)
			for(var i = 0; i < collection.length; i++) 
			{
				// Need to make sure we're looping for the obj's stuff
				for(prop in obj) 
				{
					// Just proper (keeps JSLint happy too)
					if(obj.hasOwnProperty(prop)) 
					{
						// Go through each property in the array index
						for(row in collection[i]) 
						{
							if(collection[i].hasOwnProperty(row)) 
							{
								// If the collection's record matches the criteria obj, return it
								if(prop === row && obj[prop] === collection[i][row]) 
								{
									// If qty is not specified, get all matching records
									if(qty === undefined) 
									{
										record.push(collection[i]);
									} else {
										// Only return the first matching record
										return collection[i];
									}
								}	
							}
						}
					}
				}	
			}
			
			// Return of array of matching records
			if(qty === undefined) {
				return record;
			}
		}
		
	}; // End of find();
	
};