var jOO = (function(undefined){
	var _jOO = function(){
	
		var objects = [];
		var namespaces = [];
		var length = 0;
		var root = {};
		var throwerrors = false;
		var errors = [];
		var warnings = [];
		
		var Class = {
			create:function(base){
				var nameSpace = base["namespace"];
				var className = base["name"];
				var currentNamespace = CreateNameSpaces(nameSpace, onerror);
				var currentClass = currentNamespace[className];
				var classExists = typeof currentClass === "undefined";
				if (currentNamespace === root){
					Error.setWarning("You should use a NameSpace to separate your Classes. Class: \""+className+"\".");
				}
				if(classExists){
					currentClass = currentNamespace[className] = {};
					var constructor = base["constructor"];
					var includes = base["includes"];
					var interfaces = base["implements"];
					var extension = base["extends"];
					var properties = base["properties"];
					var fields = base["fields"];
					var methods = base["methods"];
					var constants = base["constants"];
					var destructor = base["destructor"];					
					var onerror = base["error"];
					var onsuccess = base["succcess"];
					
					if(typeof constructor !== "function"){
						constructor = new Function();
						Error.setWarning("Class "+className+" does not have a Constructor. Using a default one.");
					}
					currentClass = constructor;
					
					SetDefaults(currentClass,base, onerror);
					SetConstants(currentClass,properties,onerror);
					SetProperties(currentClass,properties,onerror);
					ExtendClass(currentClass,extension, onerror);
					IncludeObjectsInClass(currentClass,includes, onerror);
					VerifyInterfacesImplementations(currentClass,interfaces, onerror);
				}
				else{
					Error.setError("Class "+className+" already exists in NameSpace "+nameSpace+".", onerror);
				}
			}
		}
		
		var SetDefaults(Class,base){
			var namespace = base.namespace;
			var name = base.name;
			var type = (typeof namespace ==="undefined" || namespace.length === 0 ? "" : namespace + ".") + name;
			var GetType = function(){
				return this["$__type__"];
			}
			var GetNameSpace = function(){
				return this["$__namespace__"];
			}
			Class["prototype"]["$GetType"] = GetType;
			Class["prototype"]["$__type__"] = type;
			Class["prototype"]["$GetName"] = GetName;
			Class["prototype"]["$__name__"] = name;
			if(type !== base["name"]){
				Class["prototype"]["$GetNameSpace"] = GetNameSpace;
				Class["prototype"]["$__namespace__"] = namespace;
			}
		}
		
		var SetConstants = function(Class,constants,onerror){
			for(var constant in constants){
				var cname = "__"+constant+"__";
				Class["prototype"][cname] = constants[constant];
				Class["prototype"][constant] = function(){
					return this[cname];
				}
			}
		}
		
		var SetProperties = function(Class,properties, onerror){
			
		}
		
		var ExtendClass = function(Class,extension, onerror){
			if(typeof extension === "function"){
				
				extension = extension();
			}
			Class["prototype"] = extension;
		}
		
		var IncludeObjectsInClass = function(Class,includes, onerror){
			if(typeof includes === "undefined"){
				Error.setMessage("No Includes were set to the Class "+Class.$GetName()+" in NameSpace "+Class.$GetNameSpace()+".");
			}
		}
		var VerifyInterfacesImplementations(Class,interfaces, onerror){
			
		}
		var IsInterfaceImplemented = function(Class,Interface, onerror){
			return true;
		}
		
		var IncludeObjectInClass = function(Class,include,Static, onerror){
			return true;
		}
		
		var CreateNameSpaces = function(namespace, onerror){
			if(typeof namespace !== "undefined" && namespace.length !== 0){
				var namespaces = namespace.split(".");
				var length = namespaces.length;			
				var currentnamespace = root;
				for(var i = 0;i<length;i+=1){
					currentnamespace = (currentnamespace[namespaces[i]] === undefined ? (currentnamespace[namespaces[i]] = {}) : currentnamespace[namespaces[i]]);
					if(currentnamespace === ""){
						Error.setError("The NameSpace you tried to create is a empty one. The NameSpace you tried to create was \""+namespace+"\".")
					}
				}
				return currentnamespace;
			}
			else{
				return root;
			}
		}
		var Error = {
			setMessage:function(message,onerror){},
			setWarning:function(message,onerror){},
			setError:function(message,onerror){},
			getErrors:function(){},
			getLastError:function(){},
			getError:function(index){}
		}
		
		return {
			getErrors:getErrors,
			throwerrors:throwerrors,
			length:length,
			Class:Class.create,
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
		},
		"values",
		{
			"name":"test",
			"samegetset":true
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
