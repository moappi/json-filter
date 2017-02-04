json-filter
=========

Installation
------------

	npm install node-json-filter

What is json-filter?
--------------
json-filter extends JSON with a filter function that will helps validate 'unverified' JSON objects.

+	Verifies object name and value type
+	Allows for multiple types of objects (arrays, json objects, strings, numbers etc..) 
+	Verifies array objects with a single filter
+	Able to verify complex json objects (nested arrays, objects etc..)

Usage
-----
```javascript
	JSON.filter = require('node-json-filter');

	var filter = new JSON.filter( {
		"string":"$string",
		"number":"$number",
		"object":{"string":"$string"},
		"array":[
		    {"string":"$string"}
		],
		"complex":{
		    "array":[
			{"string":"$string"}
		    ]
		}
	    });

	filter.apply({
           "string":"test",
            "number":123,
            "object":{"string":"test"},
            "array":[
                {"string":"test1"},
                {"string":"test2"},
                {"string":"test3"},
		{"filterout":12}
            ],
            "complex":{
                "array":[
                    {"string":"test1"},
                    {"string":"test2"},
                    {"string":"test3"}
                ]
            },
	    "filterThisOut":"something"
        });
```