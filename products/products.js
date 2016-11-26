$(document).ready(function(){

	$("#products").load("/res/templates.html #products", function(){
		$.getJSON("products.json", function(json_data){
			var template = Hogan.compile($("#products").html());
			var html = template.render(json_data);
			$("#products").html(html);
		});
	});
});