

// Select a single item in Friends and Trails lists
$(document).on('click', '.single li', function(event){
	var selectObject = this;
	var parent = $(this).parent('ul');
	$('li', parent).each(function(){
		if (this === selectObject) {
			$(this).addClass('selected');
		}
		else {
			$(this).removeClass('selected');
			
		}
	});
});

// Allows for multiple selection in Tags list
$(document).on('click', '.multiple li', function(event){
	if ($(this).hasClass('selected')){
		$(this).removeClass('selected');
	}
	else {
		$(this).addClass('selected');
	}
});



// Get rid of instructions in Trails list and add instructions to Tags list
$(document).on('click', '#friends-list .list-area ul li', function(event){
	if ($('#trail-tags .list-area ul li').length === 0) {
		$('#trail-tags p').remove();
	}
});
$(document).on('click', '#trail-tags .list-area ul li', function(event){
	$('#step-tags p').remove();
});



// Remove an item from Link multi-list
$(document).on('click', '.link .multi-list li button', function(event){

	// Remove an item from list >> ol > li > button
	$(this.parentElement).addClass('toDelete');
	$('.toDelete').remove();

});



// Create functionality for adding a new tag in Tags list
// insert input textbox in Tags list
$(document).on('click', '#add-button', function(event){
	if ($('#tag-form').length === 0){
		$('.tags .multi-list').append('<li id="new-tag"><form id="tag-form"><input id="add-tag" type="text" placeholder="Enter new tag..."></form></li>');
		$('input', '#tag-form').width($('.list-page.span2').width() - 50).focus();
	}
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
function sortList() {
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
}

function handleDropEvent(event, ui) {
	var draggable = ui.draggable;
	// checks for which tags have been added to a list item
	var exist = false;
	$('.label-list li span', this).each(function() {
		if ($(this).text() === draggable.text()) {
			exist = true;
		}
	});
	if (!exist) {
		$('.label-list', this).append('<li><span class="label label-info" ' + draggable.text() + '>' + draggable.text() + '</span></li>');

	}

}



