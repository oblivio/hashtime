# hashtime

hashtime v1.0.2

hashtime is a logic-agnostic templating framework that takes care of routing and rendering.

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
	



