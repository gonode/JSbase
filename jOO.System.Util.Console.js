var OO;
var include1, include2;
var iFace;
var oClass;

(function(jOO,undefined){
	jOO.Class({
		"namespace":"System.Util",
		"name":"Console",
		"includes":{
			"static":[include1,include2,{
				test : function(){
					
				}
			}],
			"prototype":[{
				"empty" : ""
			}]
		},
		"implements":[iFace],
		"extends": oClass,
		"properties":[{
				"name":"Name",
				"get":true,
				"set":true
			},
			{
				"name":"Key",
				"set":true,
				"get":false
			},
			{
				"name":"Files",
				"set":function(file){
					
				},
				"get":"files"
			},
			{
				"name":"Chars",
				"set":function(char){
				
				},
				"get":function(index){
					
				}
		},
		"values",
		{
			"name":"test",
			"getset":true
		},
		{
			"name":"lookup",
			"getset":function(lookup){
				
			}
		},
		{
			"fields":{
				"get":true,
				"set":true
			}
		}],
		"fields":["length"],
		"methods":{
			"Write":function(){}
		},
		"constants":{
			"PI":3.14
		},
		"constructor":function(){
			alert("ok!");
		},
		"destructor":function(){
			
		},
		"success":function(){
			
		},
		"error":function(){
			
		}
	});

})(jOO);