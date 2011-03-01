var OO;
var include1, include2;
var iFace;
var oClass;
var jOO = (function(undefined){
	var _jOO = function(){
	
	};
	_jOO.enums = {
		
	}
	return new _jOO();
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
				empty : ""
			}]
		},
		"implements":iFace,
		"extends": oClass,
		"properties":["Name"],
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
