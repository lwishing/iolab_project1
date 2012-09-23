


// Remove an item from Link multi-list
$(document).on('click', '.link .multi-list li button', function(event){

	// Remove an item from list >> ol > li > button
	$(this.parentElement).addClass('toDelete');
	$('.toDelete').remove();

});



// Create functionality for adding a new tag in Tags list
// insert input textbox in Tags list
$(document).on('click', '.btn-success', function(event){
	$('.tags .multi-list').append('<li id="new-tag"><form id="tag-form"><input autofocus id="add-tag" type="text" placeholder="Enter new tag..."></form></li>');
});
// remove input textbox and replace with new tag
$('#tag-form').live('submit', function(event){
	newTag = $('#add-tag').val();
	$('#new-tag').remove();
	if (newTag.length >0 ) {
		$('.tags .multi-list').append('<li><span class="label label-info">' + newTag + '</span></li>');
		sortList();
		return false;
	}
	else {
		return false;
	}
	
	
});



// Makes Links table sortable and droppable; makes Tags table draggable
$(function sortList() {
	$('.link .multi-list').sortable();
	$('.link .multi-list').disableSelection();
	$('.tags .multi-list li span').draggable( {
		helper: 'clone'
	});
	$('.link .multi-list li').droppable( {
		accept: '.tags .multi-list li span',
		hoverClass: 'hovered',
		drop: handleDropEvent
	});
});

function handleDropEvent(event, ui) {
	var draggable = ui.draggable;
	for (i=0; i<$(this).children('.label-list').length; i++) {
		if (draggable.text() !== $('.label-list[i] span').text()){
			$('.label-list', this).append('<li><span class="label label-info">' + draggable.text() + '</span></li>');
		}

	}
	console.log($(this).children('.label-list').length);
	console.log($(this).children('.label-list')	);
}



