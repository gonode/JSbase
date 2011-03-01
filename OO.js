var OO;
var include1, include2;
var iFace;
var oClass;
var jOO = (function(undefined){
	var _jOO = function(){
	
	};
	
	return new _jOO();
})();

(function(jOO,undefined){
	jOO.Class({
		"namespace":"System",
		"name":"Console",
		"includes":[include1,include2,{
			test:function(){}
		}],
		"implements":iFace,
		"extends": oClass,
		"properties":["Name"],
		"members":["length"],
		"methods":{
			"Write":function(){}
		},
		"success":function(){},
		"error":function(){}
	});

	jOO.Interface({
		"namespace":"System",
		"name":"IConsole",
		"interface":{
			"Write":"method",
			"length":"member",
			"name":"property"
		}
	});
})(jOO);
