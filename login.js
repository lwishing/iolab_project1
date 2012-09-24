$(document).ready(function() {
   $("#loading_gif").hide();
   $("#login_fail_msg").hide();
   $("#login-modal").hide();
   $("#login-modal").modal("show");
   sortList();

   doc_height = $(window).height();
   $(".row-fluid.upper").height(doc_height * 0.3);
   $(".row-fluid.lower").height((doc_height - 170) * 0.7);
   $(".list-area").height((doc_height - 230) * 0.3);
   $(".list-area.link, .list-area.tags").height((doc_height - 170) * 0.7);

   doc_width = $(document).width();
   $(".row-fluid .span4").width((doc_width - 86) / 3);
   $(".row-fluid .span2").width((doc_width - 55) / 6);
   $(".row-fluid .span10").width((doc_width - 55) * 5 / 6);

   $(".tags .multi-list li span").each(function() {
      $(this).addClass($(this).text());
   })

   $("#acct").focus();

   $("#pwd").keyup(function(event){
      if (event.keyCode == 13) {
         $("#login_btn").click();
      }
   });

   $("#login_btn").click(function() {
      $("#loading_gif").show();
      $("#login_fail_msg").hide();
      $("#login_btn").removeClass("btn-primary").addClass("btn-success").html("Login...");

      var postData = {
         method: 'posts/update',
         username: $("#acct").val(),
         password: $("#pwd").val()
      };
      $.getJSON("http://courses.ischool.berkeley.edu/i290-iol/f12/resources/trailmaker/delicious_proxy.php?callback=?",
         postData,
         function(rsp){
            $("#loading_gif").hide();
            $("#login_btn").removeClass("btn-success").addClass("btn-primary").html("Submit");
            if (rsp.result_code === "200") {
               // login success
               $("#login-modal").modal("hide");
               load_friends_list(postData.username);
            } else {
               // login failed
               $("#login_fail_msg").show();
            }
         }
      );
   });

   $("#post-to-delicious").click(function(){
      if ($('.link ol li').length > 0) {
         $('#new_trail h1').text(prompt('Enter a name for your trail:') || 'My New Trail');
         saveTrail();
      }
   });
});


var step_num = 0;
function saveTrail () {
    // We need to keep track of which bookmark number we are saving, so we
    // can use the `step:2` syntax that we have established
    // When the user submitted the form we started with stepNum = 0,
    // so we can increment it each time we call saveTrail
    step_num++;

    // Get the first bookmark to save, which is the first element of the .link list
    var bookmark = $('.link ol li:first');

   // Change spaces in the trail name to underscores to follow our trail syntax
   // By default, the .replace() method doesn't replace ALL the occurrances
   // of a string, so we are using the global flag in our regular expression
   // to replace everything. The global flag is set with the "g" after
   // the regular expression (/ /g)
   var tag_applied = 'trail:' + $('#new_trail h1').text().toLowerCase().replace(/ /g, '_');
    // Make tags from the tags applied to it and original tags in data

//    var tag_applied =  (bookmark.data('tags') == "" ? "" : bookmark.data('tags').join(',') + ',') + 'step:' + step_num;
    tag_applied += ',step:' + step_num;

    $(".label-list li", '.link ol li:first').each(function(){
       tag_applied += "," + $(this).text(); 
    });

    // Assemble the data to send to Delicious
    var postData = {
        url: bookmark.find('a').attr('href'),
        description: bookmark.find('a').text(),
        extended: " ",
        tags: tag_applied,
        method: 'posts/add',
        username: $("#acct").val(),
        password: $("#pwd").val()
    };

    // Send the data to Delicious through a proxy and handle the response
    // Use $.post if the script is located on the same server
    // Otherwise, use $.get to avoid cross-domain problems
    // $.post('delicious_proxy.php',
    $.getJSON("http://courses.ischool.berkeley.edu/i290-iol/f12/resources/trailmaker/delicious_proxy.php?callback=?",
    postData,
     function(rsp){
        if (rsp.result_code === "access denied") {
            alert('The provided Delicious username and password are incorrect.');
        } else if (rsp.result_code === "something went wrong") {
            alert('There was an unspecified error communicating with Delicious.');
        } else if (rsp.result_code === "done") {
            // Bookmark was saved properly
            $('.link ol li:first').remove(); // Remove the line for the bookmark we just saved
            if ($('.link ol li').length > 0) {
                // Save the next bookmark in the trail in 1000ms (1 second)
                // We have to wait this period of time to comply with the
                // terms of the Delicious API. If we don't we may have access denied.
                setTimeout(saveTrail, 1000);
            } else {
                // We're done saving the trail
                alert ("Your trail has been saved!");
            }
        }
    });
}
