$(document).ready(function(){
	// load into header
	$("#header").load("/res/templates.html #header > *");
	// load into navi
	$("#navi").load("/res/templates.html #navi > *");
});