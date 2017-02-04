//Copyright (c) 2017 Crystalline Technologies
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'),
//  to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
//  and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
//  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


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
	
	//Filter the object's properties          
	for(var prop in _filter) {
	
		var _obj = {
			"val":obj[prop],
			"type":typeof(obj[prop])
		};
		
		//Determine if we have an array
		if(Array.isArray(obj[prop])) _obj.type = "array";
		
		var _test = {
			"val":_filter[prop],
			"type":typeof(_filter[prop])
		};
		
		//Determine if we have an array
		if(Array.isArray(_filter[prop])) _test.type = "array";
		
		//Check the type of object we're looking for
		switch(_test.type){
			
			//Array
			case "array":
				//Make sure this the source is an object
				if(_obj.type === _test.type) out[prop] = this.array(_obj.val,_test.val);
			break;
			
			//Object
			case "object":
				//Make sure this the source is an object
				if(_obj.type === _test.type) out[prop] = this.obj(_obj.val,_test.val);
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
								if(test === "true") out[prop] = true;
								if(test === "false") out[prop] = false;

								//Otherwise ignore
							break;
							
							//Get the boolean from the number
							case "number":
								out[prop] = (_obj.val > 0);
							break;

							//Just get the value from the boolean
							case "boolean":
								out[prop] = _obj.val;
							break;
							
							//Otherwise don't add it
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
								if(val !== undefined && !isNaN(val)) out[prop] = val; 
							break;
							
							//It's a number use the value
							case "number":
								out[prop] = _obj.val;
							break;

							//Otherwise don't add it
							default:
							break;
						}
					break;
					
					//If it's a string
					case "$string":
						//Test the source against the value of the object (which represents the type we expect)
						if(_obj.type === "string")  out[prop] = _obj.val;
					break;

					
				}
			break;
			
			//Not supported
			default:
			break;
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