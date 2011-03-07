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
			Create : function(base){
				var nameSpace = base["namespace"];
				var className = base["name"];
				var currentNamespace = this.CreateNameSpaces(nameSpace, onerror);
				var currentClass = currentNamespace[className];
				var classExists = typeof currentClass === "undefined";
				if (currentNamespace === root){
					Error.setWarning("You should use a NameSpace to separate your Classes. Class: \""+className+"\".");
				}
				if(!classExists){
					currentClass = currentNamespace[className] = {};
					var constructor = base["constructor"];//COMPLETE
					var includes = base["includes"];//
					var interfaces = base["implements"];//
					var extension = base["extends"];//COMPLETE
					var properties = base["properties"];//COMPLETE
					var fields = base["fields"];//COMPLETE
					var methods = base["methods"];//COMPLETE
					var constants = base["constants"];//COMPLETE
					var destructor = base["destructor"];//COMPLETE
					var onerror = base["error"];//COMPLETE
					var onsuccess = base["succcess"];
					
					this.SetConstructor(currentClass,className,constructor, onerror);//COMPLETE
					this.IncludeObjectsInClass(currentClass,includes, onerror);//
					this.ExtendClass(currentClass,extension, onerror);//COMPLETE					
					this.SetDefaults(currentClass,base, onerror);//COMPLETE
					this.SetConstants(currentClass,properties,onerror);//COMPLETE
					this.SetProperties(currentClass,properties,onerror);//COMPLETE
					this.SetFields(currentClass,fields,onerror);//COMPLETE
					this.SetMethods(currentClass,methods,onerror);//COMPLETE
					this.SetDestructor(currentClass,destructor,onerror);//COMPLETE
					this.VerifyInterfacesImplementations(currentClass,interfaces, onerror);//
				}
				else{
					Error.setError("Class "+className+" already exists in NameSpace "+nameSpace+".", onerror);
				}
			},
			SetConstructor : function(Class,name,constructor,onerror){
				if(typeof constructor !== "function"){
					constructor = new Function();
					Error.setWarning("Class "+name+" does not have a Constructor. Using a default one.");
				}
				Class = constructor;
			},
			SetDestructor : function(Class,destructor,onerror){
				if(typeof Class["prototype"]["Dispose"] === "undefined"){
					Class["prototype"]["Dispose"] = function(){
						this = undefined;
					}
					Error.setMessage("Using a Default Destructor Method for Class \""+Class.$GetType+"\".");
				}
			},
			SetMethods : function(Class,methods,onerror){
				for(var method in methods){
					this.SetMethod(Class,method,methods[method],onerror);
				}
			},
			SetMethod : function(Class,name,method,onerror){
				Class["prototype"][name] = method;
			},
			SetFields = function(Class,fields,onerror){
				
				for(var i = 0;i < fields.length;i+=1){
					Class["prototype"][fields[i]] = null;
				}
				
			},
			SetDefaults : function(Class,base){
				var namespace = base.namespace;
				var name = base.name;
				var type = (typeof namespace === "undefined" || namespace.length === 0 ? "" : namespace + ".") + name;
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
			},
			SetConstants : function(Class,constants,onerror){
				for(var constant in constants){
					var cname = "__"+constant+"__";
					Class["prototype"][cname] = constants[constant];
					Class["prototype"][constant] = new Function(
						"return this[" + cname + "];"
					);
				}
			},
			SetProperties : function(Class,properties, onerror){
				if(properties instanceof Array){
					for(var i = 0;i < properties; i+=1){
						var property = properties[i];
						if(typeof property === "object"){
							this.SetProperty(Class,{
								"name":property["name"],
								"get":property["get"],
								"set":property["set"],
								"getset":property["getset"]
							},onerror);
						}
						else if(typeof property === "string"){
							this.SetProperty(Class,{
								"name":property,
								"get":true,
								"set":true
							},onerror);
						}
					}
				}
				else if(properties instanceof Object){
					if(("get" in properties) || ("set" in properties) || ("getset" in properties)){
						this.SetProperty(Class,{
							"name":properties["name"],
							"get":properties["get"],
							"set":properties["set"],
							"getset":properties["getset"]
						},onerror);
					}
					else{
						for(var name in properties){
							this.SetProperty({
								"name":name,
								"get":properties[name]["get"],
								"set":properties[name]["set"],
								"getset":properties[name]["getset"]
							});
						}
					}
				}
			},
			SetProperty : function(Class,property, onerror){
				var Name = property["name"];
				/*
					var property = {
						"name" : "",
						"get : "",
						"set" : "",
						"getset" : ""
					}
				*/
				if(typeof Name !== "undefined"){
					var Get = property["get"];
					var Set = property["set"];
					var GetSet = property["getset"];
					if(typeof Get !== "undefined" || typeof Set !== "undefined" || typeof GetSet !== "undefined"){
						var Field = "__" + Name + "__";
						Class["prototype"][Field] = null;
						if(typeof Get !== "undefined"){
							if(Get === true){
								this.SetMethod(Class,"get"+Name,new Function(
									"return this["+Field+"];"
								),onerror);
							}
							else if(typeof Get === "function"){
								this.SetMethod(Class,"get"+Name,Get,onerror);
							}
						}
						if(typeof Set !== "undefined"){
							if(Set === true){
								this.SetMethod(Class,"set"+Name,new Function(
									"value",
									"this[" + Field + "] = value;"
								),onerror);
							}
							else if(typeof Set === "function"){
								this.SetMethod(Class,"set"+Name,Set,onerror);
							}
						}
						if(typeof GetSet !== "undefined"){
							if(GetSet === true){
								this.SetMethod(Class,Name,new Function(
									"value",
									"return typeof value === 'undefined' ? this["+Field+"] : this[" + Field + "] = value;"
								),onerror);
							}
							else if(typeof GetSet === "function"){
								Class["prototype"][Name] = GetSet;
								this.SetMethod(Class,Name,GetSet,onerror);
							}
						}
					}
					else{
						Error.setError("The property named \""+Name+"\" has nothing to get and set in the Class \""+Class.$GetType()+"\".");
					}
				}
				else{
					Error.setError("No name was given to the property in Class \""+Class.$GetType()+"\".")
				}
			},
			ExtendClass : function(Class,extension, onerror){
				if(typeof extension === "function"){
					
					extension = extension();
				}
				Class["prototype"] = extension;
			},
			IncludeObjectsInClass : function(Class,includes, onerror){
				if(typeof includes === "undefined"){
					Error.setMessage("No Includes were set to the Class "+Class.$GetName()+" in NameSpace "+Class.$GetNameSpace()+".");
				}
				
			},
			VerifyInterfacesImplementations : function(Class,interfaces, onerror){
				
			},
			IsInterfaceImplemented : function(Class,Interface, onerror){
				return true;
			},
			IncludeObjectInClass : function(Class,include,Static, onerror){
				return true;
			},
			CreateNameSpaces : function(namespace, onerror){
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
			Class:Class.Create,
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
