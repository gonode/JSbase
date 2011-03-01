var OO;
var include1, include2;
var iFace;
var oClass;

OO.Class({
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

OO.Interface({
	"namespace":"System",
	"name":"IConsole",
	"interface":{
		"Write":"method",
		"length":"member",
		"name":"property"
	}
})