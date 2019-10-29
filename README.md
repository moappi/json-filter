json-filter
=========

Usage (browser)
------------

	var filter = new JSON.filter(<json filter>);

	var filteredJSON = filter.apply(<json object>);


Installation (Node.js)
------------

	npm install node-json-filter

	JSON.filter = require('node-json-filter');


What is json-filter?
--------------
json-filter extends JSON with a filter function that will helps validate 'unverified' JSON objects.

+	Verifies object name and value type
+	Allows for multiple types of objects (arrays, json objects, strings, numbers etc..) 
+	Verifies array objects with a single filter
+	Able to verify complex json objects (nested arrays, objects etc..)
+	Allows for simple switch cabilitity (case & default)

Usage
-----
```javascript

	//If using in NODE.js (otherwise ignore)
	JSON.filter = require('node-json-filter');
	
	var filter = new JSON.filter( {
		"str":"$string",
		"num":"$number",
		"bool":"$boolean",
		"obj":{"str":"$string"},
		"arry":[
		    {"str":"$string"}
		],
		"complex":{
		    "arry":[
			{"num":"$number"}
		    ],
		    "obj":{"str":"$string"},
		    "num":"$number"
		},
		"parsing":[{
		    "num":"$number",
		    "bool":"$boolean",
		    "str":"$string"
		}],
		"all":{
		    "$all":{
		        "str":"$string",
		        "num":"$number"
		    }
		},
		"default":{
		    "$default":{
		        "str":"$string",
		        "num":"$number",

			"$default":"$string"
		    }
		}
	});

	console.log( filter.apply({
            "str":"test",
            "num":123,
            "bool":true,
            "obj":{"str":"test"},
            "arry":[
                {"str":"test1"},
                {"str":"test2"},
                {"str":"test3"}
            ],
            "complex":{
                "arry":[
                    {"num":12},
                    {"num":"123"},
                    {"num":12.3}
                ],
                "obj":{"str":"test123"},
                "num":"12.5"
            },
    	    "parsing":[
        		{"num":"12",
        		 "bool":"true",
        		 "str":"some str"},
        		{"num":"12.5",
        		 "bool":"false"},
        		{"num":"don't show this one",
        		 "bool":0},
        		{"bool":1},
        		{"bool":"don't show this one"}
    	    ],
    	    "all":{
    	        "test1":{
    	            "str":"test",
    	            "num":123
    	        },
    	        "test2":{
    	            "str":"test",
    	            "num":1234
    	        }
    	    },

	    "default":{
	    	//Specified directly (case)
    	        "str":"testy",
    	        "num":123,
		
		//Covered by $default
		"someother":"stuff",
		"plusthis":"stuff"
    	    },
    	    "filterout":"you shouldn't see this property"
        }));
```