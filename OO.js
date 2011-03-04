var OO;
var include1, include2;
var iFace;
var oClass;
var jOO = (function(undefined){
	var _jOO = function(){
	
		var objects = [];
		var namespaces = [];
		var length = 0;
		
		var Class = function(base){
			var c = {};
			return c;
		}
		
		
		
		return {
			length:length,
			Class:Class,
			Interface:Interface,
			getClassesByNameSpace:getClassesByNameSpace,
			getClassesByName:getClassesByName,
			getNameSpaces:getNameSpaces,
			getInterFacesByNameSpace:getInterFacesByNameSpace,
			getInterFacesByName:getInterFacesByName
		}
	};
	return _jOO();
})();

(function(jOO,undefined){
	jOO.Class({
		"namespace":"System",
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
				"name":"Name"
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
		}],
		"fields":["length"],
		"methods":{
			"Write":function(){}
		},
		"constants":{
			"PI":3.14
		},
		"constructor":function(){
			
		},
		"destructor":function(){
			
		},
		"success":function(){
			
		},
		"error":function(){
			
		}
	});

	jOO.Interface({
		"namespace":"System",
		"name":"IConsole",
		"interface":{
			"Write":"method",
			"length":"field",
			"name":"property"
		},
		"success":function(){
			
		},
		"error":function(){
			
		},
		"implement":function(){
			
		}
	});
})(jOO);
