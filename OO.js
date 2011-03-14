/*
**	"Creative Commons" License
** 	Script to ease the creation of "Classes" in JavaScript in order to create objects of them.
**	2011
**	João Alves de Souza Neto
**	
**	Read: http://creativecommons.org/licenses/by-nc-sa/3.0/
**
**	You are free:
**
**		* to Share — to copy, distribute and transmit the work
**		* to Remix — to adapt the work
**
**	Under the following conditions:
**
**		* Attribution — You must attribute the work in the manner specified by the author or licensor (but not in any way that suggests that they endorse you or your use of the work).
**		* Noncommercial — You may not use this work for commercial purposes.
**		* Share Alike — If you alter, transform, or build upon this work, you may distribute the resulting work only under the same or similar license to this one. 
**
*/

var jOO = (function(undefined){
	var _jOO = function(){
	
		var objects = [];
		var namespaces = [];
		var length = 0;
		var root = {};
		var throwerrors = false;
		var errors = [];
		var warnings = [];
		
		var _constants = {
			"get_prefix":"get",
			"set_prefix":"set",
			"getset_prefix":"getset",
			"constant_prefix":"$__",
			"constant_suffix":"__",
			"private_prefix":"__",
			"private_suffix":"__",
			"interface_properties_name":"$__properties__",
			"interface_methods_name":"$__methods__",
			"interface_fields_name":"$__fields__",
			"interface_implementation_tester":"IsImplemented",
			"interface_test_for_methods":"$__TestForMethods",
			"interface_test_for_properties":"$__TestForProperties",
			"interface_test_for_fields":"$__TestForFields"
		}
		
		var _namespace = {
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
		
		var _class = {
			Create : function(base){
				var nameSpace = base["namespace"];
				var className = base["name"];
				var onerror = base["error"];//COMPLETE
				var currentNamespace = _namespace.CreateNameSpaces(nameSpace, onerror);
				var currentClass;
				var classNotExists = typeof currentNamespace[className] === "undefined";
				if (currentNamespace === root){
					Error.setWarning("You should use a NameSpace to separate your Classes. Class: \""+className+"\".");
				}
				if(classNotExists){
					//currentClass = currentNamespace[className] = function(){};
					var Constructor = base["constructor"];//COMPLETE
					var includes = base["includes"];//
					var interfaces = base["implements"];//
					var extension = base["extends"];//COMPLETE
					var properties = base["properties"];//COMPLETE
					var fields = base["fields"];//COMPLETE
					var methods = base["methods"];//COMPLETE
					var constants = base["constants"];//COMPLETE
					var destructor = base["destructor"];//COMPLETE
					var onsuccess = base["success"];
					
					if(typeof Constructor !== "function"){
						Constructor = new Function();
						Error.setWarning("Class "+className+" does not have a Constructor. Using a default one.");
					}
					currentClass = Constructor;
					
					if(typeof onerror === "undefined"){
						onerror = function(){};
					}
					if(typeof onsuccess === "undefined"){
						onsuccess = function(){};
					}
					
					//_class.SetConstructor(currentClass,className,Constructor, onerror);//COMPLETE
					_class.IncludeObjectsInClass(currentClass,includes, onerror);//
					_class.ExtendClass(currentClass,extension, onerror);//COMPLETE					
					_class.SetDefaults(currentClass,base, onerror);//COMPLETE
					_class.SetConstants(currentClass,constants,onerror);//COMPLETE
					_class.SetProperties(currentClass,properties,onerror);//COMPLETE
					_class.SetFields(currentClass,fields,onerror);//COMPLETE
					_class.SetMethods(currentClass,methods,onerror);//COMPLETE
					_class.SetDestructor(currentClass,destructor,onerror);//COMPLETE
					_class.VerifyInterfacesImplementations(currentClass,interfaces, onerror);//
					currentNamespace[className] = currentClass;
					onsuccess();
				}
				else{
					Error.setError("Class "+className+" already exists in NameSpace "+nameSpace+".", onerror);
				}
			},
			SetConstructor : function(Class,name,Constructor,onerror){
				if(typeof Constructor !== "function"){
					Constructor = new Function();
					Error.setWarning("Class "+name+" does not have a Constructor. Using a default one.");
				}
				Class = Constructor;
			},
			SetDestructor : function(Class,destructor,onerror){
				if(typeof Class["prototype"]["Dispose"] === "undefined"){
					Class["prototype"]["Dispose"] = new Function(
						"this = undefined;"
					);
					Error.setMessage("Using a Default Destructor Method for Class \""+Class.$GetType+"\".");
				}
			},
			SetMethods : function(Class,methods,onerror){
				for(var method in methods){
					_class.SetMethod(Class,method,methods[method],onerror);
				}
			},
			SetMethod : function(Class,name,method,onerror){
				Class["prototype"][name] = method;
			},
			SetFields : function(Class,fields,onerror){				
				for(var i = 0;i < fields.length;i+=1){
					Class["prototype"][fields[i]] = null;
				}
				
			},
			SetConstants : function(Class,constants,onerror){
				for(var constant in constants){
					_class.SetConstant(Class,constant,constants[constant],false,onerror);
				}
			},
			SetDefaults : function(Class,base){
				var nameSpace = base["namespace"];
				var name = base["name"];
				var type = (typeof namespace === "undefined" || namespace.length === 0 ? "" : namespace + ".") + name;
				
				var defaults = {
					"$GetType" : type,
					"$GetName" : name,
					"$GetNameSpace" : nameSpace
				};
				for(var Default in defaults){
					_class.SetConstant(Class,Default,defaults[Default],true,onerror);
					_class.SetConstant(Class,Default,defaults[Default],false,onerror);
				}
			},
			SetConstant : function(Class,key,value,isPrototype,onerror){
				var includeTo = isPrototype ? Class["prototype"] : Class;
				var cname = _constants["constant_prefix"]+key+_constants["constant_suffix"];
				includeTo[cname] = value;
				includeTo[key] = new Function(
					"return this[\"" + cname + "\"];";
				);
			},
			SetProperties : function(Class,properties, onerror){
				var isArray = (properties instanceof Array);
				if(isArray){//if(properties && !(properties.propertyIsEnumerable('length')) && typeof properties === 'object' && typeof properties.length === 'number'){//if(properties.constructor === Array){//if(properties instanceof Array){
					for(var i = 0;i < properties.length; i+=1){
						var property = properties[i];
						if(typeof property === "object"){
							_class.SetPropertiesObject(Class,property,onerror);
						}
						else if(typeof property === "string"){
							_class.SetProperty(Class,{
								"name":property,
								"get":true,
								"set":true
							},onerror);
						}
					}
				}
				else if(properties instanceof Object){
					_class.SetPropertiesObject(Class,properties,onerror);
				}
			},
			SetPropertiesObject : function(Class,properties,onerror){
					if(("get" in properties) || ("set" in properties) || ("getset" in properties)){
						_class.SetProperty(Class,{
							"name":properties["name"],
							"get":properties["get"],
							"set":properties["set"],
							"getset":properties["getset"]
						},onerror);
					}
					else{
						for(var name in properties){
							_class.SetProperty(Class,{
								"name":name,
								"get":properties[name]["get"],
								"set":properties[name]["set"],
								"getset":properties[name]["getset"]
							},onerror);
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
						var Field = _constants["private_prefix"] + Name + _constants["private_suffix"];
						Class["prototype"][Field] = null;
						if(typeof Get !== "undefined"){
							var getter = _constants["get_prefix"]+Name;
							if(Get === true){
								_class.SetMethod(Class,getter,new Function(
									"return this['"+Field+"'];"
								),onerror);
							}
							else if(typeof Get === "function"){
								_class.SetMethod(Class,getter,Get,onerror);
							}
						}
						if(typeof Set !== "undefined"){
							var setter = _constants["set_prefix"]+Name;
							if(Set === true){
								_class.SetMethod(Class,setter,new Function(
									"value",
									"this['" + Field + "'] = value;"
								),onerror);
							}
							else if(typeof Set === "function"){
								_class.SetMethod(Class,setter,Set,onerror);
							}
						}
						if(typeof GetSet !== "undefined"){
							if(GetSet === true){
								_class.SetMethod(Class,Name,new Function(
									"value",
									"return typeof value === 'undefined' ? this['"+Field+"'] : this['" + Field + "'] = value;"
								),onerror);
							}
							else if(typeof GetSet === "function"){
								Class["prototype"][Name] = GetSet;
								_class.SetMethod(Class,Name,GetSet,onerror);
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
				if(typeof extension !== "undefined"){
					if(typeof extension === "function"){
						
						extension = extension();
					}
					Class["prototype"] = extension;
				}
			},
			IncludeObjectsInClass : function(Class,includes, onerror){
				if(typeof includes === "undefined"){
					Error.setMessage("No Includes were set to the Class \""+Class.$GeType()+"\".");
				}
				else{
					var Static = includes["static"];
					var Prototype = includes["prototype"];
					var hasStatic = typeof Static !== "undefined";
					var hasPrototype = typeof Prototype !== "undefined";
					if(hasStatic || hasPrototype){
						if(hasStatic){
							_class.IncludeObjectInClass(Class,Static,true,onerror);
						}
						if(hasPrototype){
							_class.IncludeObjectInClass(Class,Prototype,false,onerror);
						}
					}
					else{
						_class.IncludeObjectInClass(Class,includes,true,onerror);
					}
				}
			},
			VerifyInterfacesImplementations : function(Class,interfaces, onerror){
				for(var Interface in interfaces){
					if(!IsInterfaceImplemented(Class,Interface,onerror){
						Error.setError("The Interface \""+Interface.$GeType()+"\" was not correctly implemented in the Class \""+Class.$GeType()+"\".");
					}
				}
			},
			IsInterfaceImplemented : function(Class,Interface, onerror){
				return Interface[_constants["interface_implementation_tester"]](Class) === true;
			},
			IncludeObjectInClass : function(Class,include,isStatic, onerror){
				for(var item in include){
					var includeItem = include[item];
					var includeTo = isStatic ? Class : Class["prototype"];
					includeTo[item] = includeItem;
				}
			}
		}
		
		var _interface = {
			Create : function(base){
				var nameSpace = base["namespace"];
				var interfaceName = base["name"];
				var onerror = base["error"];//COMPLETE
				var currentNamespace = _namespace.CreateNameSpaces(nameSpace, onerror);
				var interfaceNotExists = typeof currentNamespace[interfaceName] === "undefined";
				if (currentNamespace === root){
					Error.setWarning("You should use a NameSpace to separate your Interfaces. Interface: \""+interfaceName+"\".");
				}
				if(interfaceNotExists){
					var currentInterface ={};
					var interfaceBody = base["interface"];					
					var onsuccess = base["success"];
					var onimplement = base["implement"];
					var methods = base["methods"];
					var properties = base["properties"];
					var fields = base["fields"];
					var i;
					
					_interface.SetDefaults(currentInterface,base);
					
					for(i = 0; i < methods.length; i+=1){
						_interface.InterfaceMethod(currentInterface,methods[i],onerror);
					}
					
					for(i = 0; i < properties.length; i+=1){
						_interface.InterfaceProperty(currentInterface,properties[i],onerror);
					}
					
					for(i = 0; i < fields.length; i+=1){
						_interface.InterfaceField(currentInterface,fields[i],onerror);
					}
					
					_interface.SetImplementationTester(currentInterface,base);
					currentNamespace[interfaceName] = currentInterface;
					onsuccess();
				}
				else{
					Error.setError("Interface "+interfaceName+" already exists in NameSpace "+nameSpace+".", onerror);
				}
			},
			InterfaceMethod : function(Interface,method,onerror){
				Interface[_constants["interface_methods_name"]][method] = method;
			},
			InterfaceProperty : function(Interface,property,onerror){
				Interface[_constants["interface_properties_name"]][property] = {
					"methods" : {
						"get" : _constants["get_prefix"]+property,
						"set" : _constants["set_prefix"]+property,
						"getset" : _constant["getset_prefix"]+property
					},
					"field" : _constants["private_prefix"]+property+_constants["private_suffix"]
				}
			},
			InterfaceField : function(Interface,field,onerror){
				Interface[_constants["interface_fields_name"]][field] = field;
			},
			SetDefaults : function(Interface,base){
				var nameSpace = base["namespace"];
				var name = base["name"];
				var type = (typeof namespace === "undefined" || namespace.length === 0 ? "" : namespace + ".") + name;
				
				var defaults = {
					"$GetType" : type,
					"$GetName" : name,
					"$GetNameSpace" : nameSpace
				};
				for(var Default in defaults){
					_class.SetConstant(Interface,Default,defaults[Default],true,onerror);
					_class.SetConstant(Interface,Default,defaults[Default],false,onerror);
				}
				
				Interface[_constants["interface_properties_name"]] = {};
				Interface[_constants["interface_methods_name"]] = {};
				Interface[_constants["interface_fields_name"]] = {};
			},
			SetConstant : function(Interface,key,value,isPrototype,onerror){
				var includeTo = isPrototype ? Interface["prototype"] : Interface;
				var cname = _constants["constant_prefix"]+key+_constants["constant_suffix"];
				includeTo[cname] = value;
				includeTo[key] = new Function(
					"return this[\"" + cname + "\"];";
				);
			},
			SetInternalMethod : function(Interface,name,Method,onerror){
				Interface[name] = method;
			},
			SetImplementationTester : function(Interface,onerror){
				var tests = {
					methods : {
						"name" : _constants["interface_test_for_methods"],
						"method" : _interface.TestForMethods
					},
					properties : {
						"name" : _constants["interface_test_for_properties"],
						"method" : _interface.TestForProperties
					},
					fields : {
						"name" : _constants["interface_test_for_fields"],
						"method" : _interface.TestForFields
					}
				};
				for(var test in tests){
					var currentTest = tests[test];
					_interface.SetInternalMethod(Interface,currentTest["name"],currentTest["method"],onerror);	
				}
								
				Interface[_constants["interface_implementation_tester"]] = new Function(
					"Class",
					"var isMethodsImplemented = this[\"" + _constants["interface_test_for_methods"] + "\"](this,Class);" +
					"var isPropertiessImplemented = this[\"" + _constants["interface_test_for_properties"] + "\"](this,Class);" +
					"var isFieldsImplemented = this[\"" + _constants["interface_test_for_fields"] + "\"](this,Class);" +
					"return (isMethodsImplemented === true && isPropertiessImplemented === true && isFieldsImplemented === true);"
				);				
			},
			TestForMethods : function(Interface,Class){
				
			},
			TestForProperties : function(Interface,Class){
				
			},
			TestForFields : function(Interface,Class){
				
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
			root:root,/*COMENTAR ASSIM QUE TERMINAR DE TESTAR*/
			Class:_class.Create,
			/*getErrors:getErrors,
			throwerrors:throwerrors,
			length:length,*/
			Interface:_interface.Create/*,
			getClassesByNameSpace:getClassesByNameSpace,
			getClassesByName:getClassesByName,
			getNameSpaces:getNameSpaces,
			getInterFacesByNameSpace:getInterFacesByNameSpace,
			getInterFacesByName:getInterFacesByName*/
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

	jOO.Interface({
		"namespace":"System",
		"name":"IConsole",
		"interface":{
			"methods":["Write"],
			"fields":["length"],
			"properties":["name"]
		},
		"success":function(){
			
		},
		"error":function(){
			
		},
		"implement":function(){
			
		}
	});

})(jOO);

alert(jOO.root);
var Console = new jOO.root.System.Util.Console();
alert(Console.$GetType());
alert(jOO.root.System.Util.Console.$GetType());