// Create an empty global object where we can store settings for connecting to Delicious
var delicious = {};
var trail = '';
var step = '';
var delicious_json= [];
var step_flag=false;


// Load Friends List
function load_friends_list(user_name) {
	console.log("load_friends_list");
	username = user_name;
	var number =0
	// Friends-List
//	sleep(100);
	$.getJSON('http://feeds.delicious.com/v2/json/networkmembers/' + username + '?callback=?',
	 function(json){
		$(json).each(function(index) {
			// this.user // user name
			// this.dt // time to follow
			$('<li  class="friend-username" name='+this.user+'></li>').html('<span id=user-'+number+' >' + this.user+'</span>')
				.appendTo('#friends-list ul');
				number +=1;
			});
	});
	load_user_tags(username);
	return false;
}

// Load user Tags
function load_user_tags(username) {
	console.log("load_tags");
//	sleep(1000);
	$.getJSON('http://feeds.delicious.com/v2/json/' + username + '?callback=?',
	 function(json){
			$(json).each(function(index) {
				// this.u // url
				// this.d // description
				// this.n // extended notes
				// this.t // array of tags
				$(this.t).each(function(){
					$('<li></li>').html('<span>' + this+'</span>')
						.appendTo('#user-tags ul');
				});
			});
	});
}

// Load trail Tags
function load_trail_tags(username) {
	console.log('trail_tags');
	var trail_name ='';
	var exist_flag = false;

	$.getJSON('http://feeds.delicious.com/v2/json/' + username + '?count=50&callback=?',
	 function(json){
		$(json).each(function(index) {
				// this.u // url
				// this.d // description
				// this.n // extended notes
				// this.t // array of tags
				temp_json = this;
					$(this.t).each(function(){
						if(this.substring(0,5) =='trail'){
							trail_name =this;
							exist_flag = false;

							// prevent duplication
							$('#trail-tags ul li').each(function(){
									if ($(this).attr('name') == trail_name){
											exist_flag=true;
									}
							});
							if (!exist_flag){
								$('<li class="trail-lists" name='+this+'></li>').html('<span>' + this+'</span>')
									.appendTo('#trail-tags ul');
							}
						}
					});
		});
		load_bookmarks(username, json);
	});
}

// Load step Tags
function load_step_tags(username, trail_name) {		
		console.log('step_tags');

		$.getJSON('http://feeds.delicious.com/v2/json/tags/'+username+'/'+trail_name+'?callback=?',
			function(json){
					$(json).each(function(index){
							for( var key in this){
									if(this.hasOwnProperty(key) && key !=trail_name &&  key.substring(0,4)  !=  'step'){
											$('<li class="step-lists" name='+key+'></li>').html('<span>' +key+'</span>')
											.appendTo('#step-tags ul');							
									}
							}
					});
			load_tags_bookmarks(username, trail_name);
		});
}

// Load Bookmarks
function load_bookmarks(username, json_file) {
	console.log("load_bookmarks");
	$(json_file).each(function() {
		// this.u // url
		// this.d // description
		// this.n // extended notes
		// this.t // array of tags
		
		$('<li></li>').html('<span class="badge badge-warning">123</span>')
				.append('<span class="label label-info">tag</span>')
				.append('<a href="'+this.u+'">' + this.d+'</a>')
				.append('<button class="btn btn-danger"><i class="icon-remove icon-white"></i></button>')
				.data('extended', this.n)
				.data('tags', this.t)
				.appendTo('#bookmarks ol');
		});
		//$('#bookmarks li').draggable({revert: true});
}

// Load final Bookmarks
function load_tags_bookmarks(username, tags_name) {
	console.log("load_tags_bookmarks");
	var exist_flag = false;
	var trail_match_flag= false;
	var step_match_flag= false;
	var temp_url = '';
	$.getJSON('http://feeds.delicious.com/v2/json/' + username + '/'+tags_name+'?callback=?',
	 function(json){
		$(json).each(function(index) {
				// this.u // url
				// this.d // description
				// this.n // extended notes
				// this.t // array of tags
					temp_url =this.u;

					// prevent duplication
					$('#bookmarks ol li a').each(function(){
							if ($(this).attr('href') == temp_url){
									exist_flag=true;
							}
					});
					if (!exist_flag){

						$('<li></li>').html('<span class="badge badge-warning">123</span>')
								.append('<span class="label label-info">tag</span>')
								.append('<a href="'+this.u+'">' + this.d+'</a>')
								.append('<button class="btn btn-danger"><i class="icon-remove icon-white"></i></button>')
								.data('extended', this.n)
								.data('tags', this.t)
								.appendTo('#bookmarks ol');
					}
		});
	});
}

// When users click on a link, open it in a new window
$('a').live('click', function() {
	window.open($(this).attr('href'));
	return false;
});

// event when clicking friend name
$('.friend-username').live('click',function(){
				username = $(this).attr("name");
				console.log('user_clicked');
				console.log('username :' +username);
				$('#bookmarks ol').html('');
				$('#trail-tags ul').html('');
				$('#step-tags ul').html('');
				load_trail_tags(username);
});

// event when clicking trail tags
$('.trail-lists').live('click',function(){
				console.log('trail_clicked');
				trail = $(this).attr("name");
				$('#bookmarks ol').html('');
				$('#step-tags ul').html('');
				step_flag= false;
				load_step_tags(username, trail);
});
// event when clicking friend name
$('.step-lists').live('click',function(){
				console.log('step_clicked');
				step = $(this).attr("name");
				if (!step_flag){
					$('#bookmarks ol').html('');
				}
				step_flag = true;
				tags_name = trail + '+' + step;
				load_tags_bookmarks(username,tags_name);
});