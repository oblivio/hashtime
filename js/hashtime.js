/*
 * HashTime v1.0.2
 * 
 * */
function HashTime($,Handlebars){
	//config
	this.hashPrefix = '/';
	//trackers
	this.landinghash = '';
	this.lasthash = '';
	this.currenthash = '';
	this.landingHTMLPage='';
	//URL Data
	this.URLParameters = [];
	this.URLQuery = '';
	//Template Data
	this.titledata = {};
	this.templatedata = {};
	this.template = null; //main app template
	this.sharedtemplatedata = {};
	this.partials = [];
	//General
	this.imagesToPreload = [];
	this.onDOMReady = function(){console.log('nothing set for DOM ready')};
};
//Core Functions
HashTime.prototype._init = function(){
	//internal init()
	var HashTime = this;
	
	HashTime.setLanding();
	
	if(window.location.hash.length == 0){
		var tmpHash = String(HashTime.landingHTMLPage).replace('.html','');
		if(tmpHash == ''){
			tmpHash = 'index';
		}
		HashTime.currenthash = HT.hashPrefix + tmpHash;
		HashTime.landinghash = HashTime.currenthash;
	}else{
		//malformed URL where hash contains queryString
		//Ex: index.html#example-one?custom_param=A
		//will be fixed to => index.html?custom_param=A#example-one
		
		var hashData = String(window.location.hash).split('?');
		var trueHash = hashData[0];
		var trueQuery = "";
		var hashHasQuery = false;
		
		if(typeof hashData[1] !== 'undefined'){
			trueQuery = hashData[1];
			hashHasQuery = true;
		}
		if(!hashHasQuery){
			console.log('clean hash');
			HashTime.landinghash = trueHash;
			HashTime.currenthash = trueHash;
		}else{
			//fix URL request //forces refresh	
	    	location.href = HashTime.landingHTMLPage + "?" +trueQuery+HT.hashPrefix+trueHash;
	    	return false;
		}
		
		
	}
	HashTime.URLParameters = HashTime._GET();
	HashTime.URLQuery = HashTime._query();
};
HashTime.prototype.init = function(){
	//external init()
	var HashTime = this;
	HashTime.setAppTemplate();
	window.location.hash = '';
	var nohash = String(HashTime.currenthash).replace('#','');
	nohash = String(nohash).replace(HashTime.hashPrefix,'');
	
	if(nohash == ''){
		nohash = String(HashTime.landingHTMLPage).replace('.html','');
	}
	if(nohash == ''){
		nohash =  'index';
	}
	window.location.hash = HashTime.hashPrefix  + nohash;
	
};
HashTime.prototype._GET = function(paramKey){
	var HashTime = this;
	//http://stackoverflow.com/questions/5818269/javascript-window-location-href-without-hash
	var urlSTR = location.protocol+'//'+location.hostname+(location.port?":"+location.port:"")+location.pathname+(location.search?location.search:"");
	
		var params = [];
		if(HashTime.URLParameters.length == 0){
			//http://papermashup.com/read-url-get-variables-withjavascript/
			var vars = {};
			String(urlSTR).replace( 
				/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
				function( m, key, value ) { // callback
					vars[key] = value !== undefined ? value : '';
				}
			);
			params = vars;
		}else{
			params = HashTime.URLParameters;
		}
		
		if ( paramKey ) {
			return params[paramKey] ? params[paramKey] : null;	
		}
		return params;
	
	
};
HashTime.prototype.imagePreload = function(){
	var HashTime = this;
	var imgArray = HashTime.imagesToPreload;
	for(var i = 0; i < imgArray.length; i++){
		console.log('preloading image',imgArray[i]);
		(new Image).src =  imgArray[i];
	}
	
};
HashTime.prototype.render = function(){
	window.scrollTo(0,0);
	var HashTime = this;
	var tplData = HashTime.sharedtemplatedata;
	
	var prefix = "is-";
	var tplIs = window.location.hash;
	var nohash = String(tplIs).replace('#','');
	nohash = String(nohash).replace(HashTime.hashPrefix,'');
	
	if(nohash.length == 0){
		nohash = String(HashTime.landingHTMLPage).replace('.html','');
	}
	if(typeof HashTime.templatedata[nohash] !== 'undefined'){
		console.log('HashTime.templatedata[nohash]',HashTime.templatedata[nohash]);
		tplData = jQuery.extend({},HashTime.sharedtemplatedata,HashTime.templatedata[nohash]);
	}
	var strCamelCase = function(str){
		//http://stackoverflow.com/questions/6660977/convert-hyphens-to-camel-case-camelcase
		var myString = prefix + str;
		var camelCased = myString.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
		return camelCased;
	};
	tplData[strCamelCase(nohash)] = true;
	
	HashTime._setPageTitle();
	
	$('body').html(HashTime.template(tplData),function(){
		console.log('render!',tplData);
		HashTime.onDOMReady();
	});
	
};
HashTime.prototype._query = function(blockArrIn){
	var HashTime = this;
	var query  = '?';
	var blockArray = [];
	if(typeof blockArrIn !== 'undefined'){
		blockArray = blockArrIn;
	}
	$.each(HashTime.URLParameters,function(key,val){
		if(jQuery.inArray(key, blockArray) !== -1){
			//ignored parameter
		}else{
			query += key+'='+val+'&';
		}
	});
	return query;
};
HashTime.prototype._query2array = function(){
	var HashTime = this;
	var vars = {};
	console.log('MayflowerApp.URLQuery',HashTime._query());
	String(HashTime._query()).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			switch(key){
			//filter by key if needed
			default:
				vars[key] = value !== undefined ? value : '';
				break;
			}
		}
	);
	return vars;
};
//Helper Functions
HashTime.prototype.isTouchDevice = function(){
	 return 'ontouchstart' in window; 
};
HashTime.prototype._registerPartial = function(partialID){
	if(partialID && $("[data-template-name='"+partialID+"']").length > 0){
		Handlebars.registerPartial(partialID,$("[data-template-name='"+partialID+"']").html());	
		return true;
	}else{
		return false;
	}
};
//Setter Functions
HashTime.prototype.setPreloadImages = function(arr){
	var HashTime = this;
	if( Object.prototype.toString.call( arr ) === '[object Array]' ) {
		HashTime.imagesToPreload = arr;
	}
};
HashTime.prototype.setTitleData = function(tplName,tplTitle){
	var HashTime = this;
	if(typeof HashTime.titledata[tplName] === 'undefined'){
		HashTime.titledata[tplName] = '';
	}
	HashTime.titledata[tplName] = String(tplTitle);
};

HashTime.prototype.setTitleObj = function(newObj){
	var HashTime = this;
	if(typeof newObj === 'object'){
		$.each(newObj,function(key,val){
			if(typeof HashTime.titledata[key] === 'undefined'){
				HashTime.titledata[key] = '';
			}
			HashTime.titledata[key] = String(val);
		});
	}
};
HashTime.prototype._setPageTitle = function(){
	var HashTime = this;
	var newTitle = '';
	var nohash = String(HashTime.currenthash).replace('#','');
	nohash = String(nohash).replace(HashTime.hashPrefix,'');
	if(nohash == ''){
		nohash = 'index';
	}
	if(typeof HashTime.titledata[nohash] !== 'undefined'){
		newTitle = HashTime.titledata[nohash];
	}
	document.title = newTitle;
};
HashTime.prototype.setTemplateData = function(data,isShared){
	var HashTime = this;
	if(typeof data === 'object' && isShared){
		HashTime.sharedtemplatedata = jQuery.extend(data,HashTime.sharedtemplatedata);
	}else if(typeof data === 'object'){
		
		$.each(data,function(tplkey,obj){
			if(typeof HashTime.templatedata[tplkey] === 'undefined'){
				HashTime.templatedata[tplkey] = {};
			}
			$.each(obj,function(key,val){
				HashTime.templatedata[tplkey][key] = val;
			});
		});
	}
};
HashTime.prototype.setPartials = function(arr){
	var HashTime = this;
	var success = true;
	console.log('arr',arr);
	if( Object.prototype.toString.call( arr ) === '[object Array]' ) {
	    for(var i = 0; i < arr.length; i++){
	    	var tmpPartialName = arr[i];
	    	
	    	var partialRegistered = HashTime._registerPartial(tmpPartialName);
	    	if(!partialRegistered){
	    		console.log('Failed to register partial! - Cannot proceed.',tmpPartialName);
	    		success = false;
	    		break;
	    	}else{
	    		HashTime.partials.push(tmpPartialName);
	    	}
	    }
	}else{
		success = false;
	}
	return success;
};

HashTime.prototype.setAppTemplate = function(){
	var HashTime = this;
	if(HashTime.template == null){
		console.log('setting template');
		//loop through partials to prepare the magic
		if(HashTime.partials.length == 0){
			console.log('no partials');
			return false;
		}
		var hbIF = "{{#if ";
		var prefix = "is-";
		var strCamelCase = function(str){
			//http://stackoverflow.com/questions/6660977/convert-hyphens-to-camel-case-camelcase
			var myString = prefix + str;
			var camelCased = myString.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
			return camelCased;
		};
		for(var i = 0; i < HashTime.partials.length; i++){
			var currentPartial = HashTime.partials[i] ;
			var isCurrentPartial = strCamelCase( currentPartial );
			
			if(i==0){
				hbIF += isCurrentPartial;	
				hbIF += "}}{{>"+currentPartial+"}}";
			}else{
				hbIF += "{{else if "+isCurrentPartial+"}}";
				hbIF += "{{>"+currentPartial+"}}"
			}
		}
		hbIF += "{{/if}}";
		console.log('hbIF',hbIF);
		var src = hbIF;
		HashTime.template = Handlebars.compile(src);
		return true;
	}
};
HashTime.prototype.setLanding = function(){
	var HashTime = this;
	var fileName = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
	HashTime.landingHTMLPage = fileName;
	
};
var HT = false;
(function($){
	//http://stackoverflow.com/questions/11826484/jquery-event-after-html-function
	//create a reference to the old `.html()` function
	var htmlOriginal = $.fn.html;
	//redefine the `.html()` function to accept a callback
	$.fn.html = function(html,callback){
		// run the old `.html()` function with the first parameter
		var ret = htmlOriginal.apply(this, arguments);
		// run the callback (if it is defined)
		if(typeof callback == "function"){
		 callback();
		}
		// make sure chaining is not broken
		return ret;
	};

	HT = new HashTime();
	
	var hashChange = function(changeObj){
		var oldHash = String(changeObj.oldURL).replace(/^.*?(#|$)/,'');
		var newHash = String(changeObj.newURL).replace(/^.*?(#|$)/,'');
		console.log('hash transition ',oldHash,newHash);
		HT.lasthash = oldHash;
		HT.currenthash = newHash;
		
		if(HT.lasthash == ''){
			HT.lasthash = HT.currenthash;
		}
		var nohash = String(HT.currenthash).replace('#','');
		nohash = String(nohash).replace(HT.suffixPrefix,'');
		var oldnohash = String(HT.lasthash).replace('#','');
		oldnohash = String(oldnohash).replace(HT.suffixPrefix,'');
		console.log('new,old',nohash,oldnohash);
		if(oldnohash == nohash){
			console.log('dont double render','already rendered');
		}else{
			HT.render();
		}
		
	};
	//http://stackoverflow.com/questions/9339865/get-the-hashchange-event-to-work-in-all-browsers-including-ie7#9339972
	//function hashchange  is assumed to exist. This function will fire on hashchange
	if (!('onhashchange' in window)) {
	    var oldHref = location.href;
	    setInterval(function() {
	        var newHref = location.href;
	        if (oldHref !== newHref) {
	            var _oldHref = oldHref;
	            oldHref = newHref;
	            hashChange.call(window, {
	                'type': 'hashchange',
	                'newURL': newHref,
	                'oldURL': _oldHref
	            });
	        }
	    }, 100);
	} else if (window.addEventListener) {
	    window.addEventListener("hashchange", hashChange, false);
	}
	else if (window.attachEvent) {
	    window.attachEvent("onhashchange", hashChange);    
	}
	HT._init();
}(jQuery,Handlebars));