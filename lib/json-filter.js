//     json-filter.js 1.0.0
//     (c) 2006-2019 Crystalline Technologies
//     json-filter may be freely distributed under the MIT license.


//Create new filter (with a filter object)
JSON.filter = function(_filter){
	this.filter = _filter;
};

//Run the filter on this object
JSON.filter.prototype.apply = function(obj,_filter){
	
	//Set the default filter
	if(_filter === undefined) _filter = this.filter;
	
	//Determine if we have an array to filter
	// Otherwise assume it's an object
	if( Array.isArray(_filter) ) return( this.array(obj,_filter));
	else return( this.obj(obj,_filter) );
};

//Run the filter on this object
JSON.filter.prototype.obj = function(obj,_filter){
	
	//Result should be an object
	var out = {};
	
	// Check for the $all (and DEPRECATED $any) property in the filter
	if(_filter.$any || _filter.$all) {
		
		var _filterAll = _filter.$any || _filter.$all;
		
		// Itterate over all the properties in the object and apply the same filter
		for(var prop in obj) 
			out[prop] = this.property(obj[prop],_filterAll);

	} else {
		
		//Process the switch option
		// allows for multiple filter values and a default for those that don't match
		if(_filter.$default) {
			
			//Process all filters that aren't default
			for(var prop in _filter) 
				if(prop !== "$default") out[prop] = this.property(obj[prop],_filter[prop]);
			
			//Now process all the other properties of the OBJECT using the $default filter
			// Note this will skip any properties that already have a value (not undefined)
			for(var prop in obj) 
				if(out[prop] === undefined) out[prop] = this.property(obj[prop],_filter.$default);
				
		} else {
			
			//Otherwise just process all the filters
			for(var prop in _filter)
				out[prop] = this.property(obj[prop],_filter[prop]);
		}
	}
	
	return(out);
};

//Run the filter on this array
JSON.filter.prototype.array = function(arry,_filter){
	
	//Output should be an array
	out = [];
	
	//Otherwise get the first element from the array as the template in _filter
	// and compare that to the others from obj
	if(_filter.length && Array.isArray(arry)) {
		//Itterate over the array and filter each object
		for(var i=0; i < arry.length; i++) 
			out.push( this.apply(arry[i],_filter[0]) );  
	}
	
	return(out);
};

//Run the filter on this object property
JSON.filter.prototype.property = function(val,_filter){
	
	var out;
	
	var _obj = {
		"val":val,
		"type":typeof(val)
	};
	
	//Determine if we have an array
	if(Array.isArray(val)) _obj.type = "array";
	
	var _test = {
		"val":_filter,
		"type":typeof(_filter)
	};
	
	//Determine if we have an array
	if(Array.isArray(_filter)) _test.type = "array";
	
	//Check the type of object we're looking for
	switch(_test.type){
		
		//Array
		case "array":
			//Make sure this the source is an object
			if(_obj.type === _test.type) out = this.array(_obj.val,_test.val);
		break;
		
		//Object
		case "object":
			//Make sure this the source is an object
			if(_obj.type === _test.type) out = this.obj(_obj.val,_test.val);
		break;
		
		//Defined type
		case "string":
			
			//What object type do we want?
			switch(_test.val){
				
				//If it's a boolean
				case "$boolean":
					//Check the object type
					switch(_obj.type){
						
						//If it's a string but we're expecting nubmer
						case "string":
							var test = _obj.val.toLowerCase();
							
							//Check for true or false
							if(test === "true") out = true;
							if(test === "false") out = false;

							//Otherwise ignore
						break;
						
						//Get the boolean from the number
						case "number":
							out = (_obj.val > 0);
						break;

						//Just get the value from the boolean
						case "boolean":
							out = _obj.val;
						break;
						
						//Not supported
						default:
						break;
					}
				break;

				//If it's a number
				case "$number":
				
					//Check the object type
					switch(_obj.type){
						
						//If it's a string but we're expecting nubmer
						case "string":
							//Parse this into a number
							var val = Number(_obj.val);
							
							//Worked?  then use the value
							if(val !== undefined && !isNaN(val)) out = val; 
						break;
						
						//It's a number use the value
						case "number":
							out = _obj.val;
						break;

						//Otherwise don't add it
						default:
						break;
					}
				break;
				
				//If it's a string
				case "$string":
					//Test the source against the value of the object (which represents the type we expect)
					if(_obj.type === "string")  out = _obj.val;
				break;
			}
		break;
		
		//Not supported
		default:
		break;
	}
	
	return(out);
};