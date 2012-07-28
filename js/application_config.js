/* The AJAX facility which checks whether or not a website is online. */

function parse_url (str, component) {
    var  o   = {
        strictMode: false,
        key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
        q:   {
            name:   "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-protocol to catch file:/// (should restrict this)
        }
    };
    
    var m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
    uri = {},
    i   = 14;
    while (i--) {uri[o.key[i]] = m[i] || "";}

    switch (component) {
        case 'PHP_URL_SCHEME':
            return uri.protocol;
        case 'PHP_URL_HOST':
            return uri.host;
        case 'PHP_URL_PORT':
            return uri.port;
        case 'PHP_URL_USER':
            return uri.user;
        case 'PHP_URL_PASS':
            return uri.password;
        case 'PHP_URL_PATH':
            return uri.path;
        case 'PHP_URL_QUERY':
            return uri.query;
        case 'PHP_URL_FRAGMENT':
            return uri.anchor;
        default:
            var retArr = {};
            if (uri.protocol !== '') {retArr.scheme=uri.protocol;}
            if (uri.host !== '') {retArr.host=uri.host;}
            if (uri.port !== '') {retArr.port=uri.port;}
            if (uri.user !== '') {retArr.user=uri.user;}
            if (uri.password !== '') {retArr.pass=uri.password;}
            if (uri.path !== '') {retArr.path=uri.path;}
            if (uri.query !== '') {retArr.query=uri.query;}
            if (uri.anchor !== '') {retArr.fragment=uri.anchor;}
            return retArr;
    }
}

$(document).ready(function(){

	/* This checks whether or not a website is online. */
	if(!jQuery)
	{
		alert('Error: jQuery Library has not been declared.');
	}

	var originaluri = top.location.hash;
	var afteruri = originaluri.replace("#/", "");
	
	if(originaluri) {
	
		$("#loader").show();
		$("input:first").val(afteruri);
	
		if(originaluri == afteruri) {
			return false;
		} else {
			$.getJSON("index.php?json="+afteruri, function(app){
				$("#loader").fadeOut();
				$("#output").html(app.data);
			});
		}

	}
	
	$("form[rel='ajax']").submit(function(){
	
			if($(this).find("input:first").val().substr(0, 7) == "http://") {
				var queryq = parse_url($(this).find("input:first").val());
				var query = queryq.host.replace('www.', '');
			} else {
				var query = $(this).find("input:first").val();
			}
			
			$("#loader").show();
			
			top.location.hash = "#/"+query;
			$.getJSON("index.php?json="+query, function(app){
				$("#loader").fadeOut();
				$("#output").html(app.data);
			});
			
			return false;
	});

});