$(function(){
	window.onload = function() {
		setTimeout(scrollTo, 100, 0, 1);
	};

	var source = $('#template').text();
	var template = Hogan.compile(source);

	// $('#cover > .text').append(template.render());

	// $(document).on('click', '#dlPass', function(){
	// 	var id = this.dataset.id;

	// 	$.ajax({
	// 		type: 'post',
	// 		url: '/pass',
	// 		data: {
	// 			uid: id
	// 		},
	// 		success: function(res){
	// 			console.log(res);
	// 			// location.href = 'http://createpassbook.cloudapp.net:3000/download?uid=' + id;
	// 		}
	// 	});
	// });
});
