TiStorage - A data storage library using Titanium Properties
================================

What is it?
---------------------------------------
TiStorage is an alternative to relational databases (SQL) in that you can store data, using Ti Properties, in a JSON object.  TiStorage includes the ability to store, update, create, and remove data from your 'database'.  If you're familiar with MongoDB, the interface is almost identical.

Examples:
---------------------------------------

    // Include the properties library
    Ti.include('TiStorage.js');
    
    // Start a TiStorage instance (new keywork not needed because it's generated already)	
    var conn = TiStorage();

    // Select / create the 'database'
    var db = conn.use('appc');
    
   // Select / create a 'collection' 
   var users = db.collection('users');
   
	// Another option is to select the database and collection at the same time:
	var users = conn.use('appc').collection('users);   
        
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
    
    // Update the record who's item ID is 4
    users.update(4, { 
    	'first_name': 'Richard',
    	'last_name': 'Blalock',
    	'location': 'Florida'
    });
    
    // Another example that will update all criteria that is true
    users.update({ 'last_name': 'Blalock' }, { 
    	'location': 'Florida'
    });
    
    // Finding a records index
    users.find().indexOf(user);    
    
    // Remove a record who's id is 4 (note that this is not by index but by the unique ID of the object)
    users.remove(4);
    
 	// Check if an object exists in a collection
 	users.exist({ 'last_name': 'Smith' }); // returns bool

 	// Remove ALL records in a collection
 	users.clear();    
    
    // The properties library will create one Titanium Property and store everything inside of that.  
    // Below is an example structure that is placed in a Ti Property.
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