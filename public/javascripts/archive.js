$(function(){
	$(document).on('click', '.thumbnail > img', function(){
		var id = this.dataset.value;

		if($('#'+id+' img').attr('src')==null){
			$('#'+id+' img').attr('src', '/archive/'+id+'.jpg');
		}
	});

});
