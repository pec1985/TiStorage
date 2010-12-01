TiStorage - A data storage library using Titanium Properties
================================

What is it?
---------------------------------------
TiStorage is an alternative to relational databases (SQL) in that you can store data, using Ti Properties, in a JSON object.  TiStorage includes the ability to store, update, create, and remove data from your 'database'.  If you're familiar with MongoDB, the interface is almost identical.

Examples:
---------------------------------------

    // Include the properties library
    Ti.include('TiStorage.js');
    
    // Select a 'database'.  If one is present in the PropertiesDB, it will be created
    var db = TiStorage().use('appc');
    
    // Will select an object collection called 'users'.  If it doesn't exist
    // it will be created automatically.
    var users = db.collection('users');
    
    /*
    	Querying examples
    */
    
    // Get all records in the users object
    var allUsers = users.find();
    
    // Get any record from the users object that matches the below criteria
    var smiths = users.find({ 'last_name': 'Smith' });
    
    // Get one record from the users object
    var user = users.findOne({ 'last_name': 'Smith' });
    
    /*
    	CRUD examples
    */
    // Basic creation of a new record (a new ID will be created as the index)
    users.create({ 
    	'first_name': 'Rick',
    	'last_name': 'Blalock'
    });
    
    // Update the record who's index is 4
    users.update(4, { 
    	'first_name': 'Richard',
    	'last_name': 'Blalock',
    	'location': 'Florida'
    });
    
    // Another example that will update all criteria that is true
    // NOT IMPLEMENTED YET
    users.update({ 'last_name': 'Blalock' }, { 
    	'location': 'Florida'
    });
    
    // Remove a record who's index is 4
    users.remove(4);
    
    //Finding a records index
    users.find().indexOf(user);
    
    //Removing a record, not knowing it's index (you can't delete based off of the record id)
    users.remove( users.find().indexOf(user) );
    
    // Another example that will remove all records where the criteria is true
    // NOT IMPLEMENTED YET
    users.remove({ 'last_name': 'Blalock' });
    
    
    // The properties library will create one Titanium Property and store everything inside of that.  
    // Below is an example structure.
    TiStorage = {
    	'appc': {
    		'users': [
    			{ id: 4, 'first_name': 'Rick', 'last_name': 'Blalock', 'location': 'Florida' },
    			{ id: 5, 'first_name': 'Andy', 'last_name': 'Blalock' },
    			{ id: 6, 'first_name': 'Fred', 'last_name': 'Spencer' },
    			{ id: 7, 'first_name': 'Bob', 'last_name': 'Marley' }
    		]
    	}
    };