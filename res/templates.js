$(document).ready(function(){
	// load into header
	$("#header").load("/res/templates.html #header > *");
	// load into footer
	$("footer").load("/res/templates.html #footer > *")
	// load into navi
	$("#navi").load("/res/templates.html #navi > *");
});