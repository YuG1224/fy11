$(function(){
	var source = $('#template').text();
	var template = Hogan.compile(source);

	var ws = io.connect('/');
	ws.on('user', function(data){
		console.log(data);
		if($('#grp0 .row > .user').length > $('#grp1 .row > .user').length){
			$('#grp1 .row').append(template.render(data));
		}else if($('#grp1 .row > .user').length > $('#grp2 .row > .user').length){
			$('#grp2 .row').append(template.render(data));
		}else if($('#grp2 .row > .user').length > $('#grp3 .row > .user').length){
			$('#grp3 .row').append(template.render(data));
		}else if($('#grp3 .row > .user').length > $('#grp4 .row > .user').length){
			$('#grp4 .row').append(template.render(data));
		}else if($('#grp4 .row > .user').length > $('#grp5 .row > .user').length){
			$('#grp5 .row').append(template.render(data));
		}else if($('#grp5 .row > .user').length > $('#grp6 .row > .user').length){
			$('#grp6 .row').append(template.render(data));
		}else if($('#grp6 .row > .user').length == $('#grp0 .row > .user').length){
			$('#grp0 .row').append(template.render(data));
		}
	});
	ws.emit('first');
});
