# hashtime

hashtime v1.0.0

Sample usage:


'''


<script type="text/x-handlebars" data-template-name="index">
	{{>nav}}
	
	{{#if showHelloWorld}}
		Hello, world.
	{{else}}
		Why didn't you say hello to the world?.
	{{/if}}
</script>
<script type="text/x-handlebars" data-template-name="index-alt">
	{{>nav}}
	This is another page.
</script>
<script type="text/x-handlebars" data-template-name="nav">
	<div class="navigation">
		<a href="#index">Go to index</a>
		<br />
		<a href="#index-alt">Go to index alt</a>
	</div>
	<hr />
</script>

<script
  src="http://code.jquery.com/jquery-2.2.3.min.js"
  integrity="sha256-a23g1Nt4dtEYOj7bR+vTu7+T8VP13humZFBJNIYoEJo="
  crossorigin="anonymous"></script>
<script src="js/vendor/handlebars-v4.0.5.js"></script>
<script src="js/hashtime.min.js"></script>
<script>
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
		

	
	
	
</script>


'''

