# hashtime

hashtime v1.0.4


hashtime is a logic-agnostic templating framework that takes care of routing and rendering.


Though it currently depends on jQuery - version 2.0 will depend only on HandlebarsJS. 


Here is how it works. It currently uses HandlebarsJS for the templating. What Hashtime does is map URL hashes to templates.
Using the HT.setPartials(['index','page-1','page-2']) - whenever a user accesses the URL "#/index","#/page-1", or "#/page-2", they will reach that specific template.


Each partial can contain sub-templates, allows for minimal repetition of DOM elements.


HT.setTemplateData let's you set template information for each template; And also lets you set information that can be shared across templates.


HT.setTitleData let's you configure HTML title information for each route. 


HT.setPreloadImages followed by HT.imagePreload() let's you pre-load images.


HT.URLParameters contains an array of $_GET style parameters which you can use when implementing the logic for the web application.


HT.onDOMReady can be overridden - and is a function that will be executed after the template DOM is loaded. You can specify route-specific capabilities by using a 'switch' or 'if' clause, and checking the value of HT.currenthash;


HT.init() wires everything up  


Sample usage:

```
	if(HT.setPartials(['index','index-alt','nav'])){
		HT.setTemplateData({"CreatedBy":"Fabian Valle"},true); //optional true param = shared
		HT.setTemplateData({"index":{"showHelloWorld":true}});
		HT.setTitleData("index","HT | PROBANDO");
		HT.setTitleData("index-alt","HT | 123-PROBANDO");
		HT.setPreloadImages([]);
		HT.imagePreload();
		HT.init();
	}else{
		console.log('no bueno amigo','failed to set partials');
	}
		
```
	



