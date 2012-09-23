$(document).ready(function() {
   $("#loading_gif").hide();
   $("#login_fail_msg").hide();
   $("#login-modal").hide();
   $("#login-modal").modal("show");

   doc_height = $(document).height();
   $(".row-fluid.upper").height(doc_height * 0.3);
   $(".row-fluid.lower").height((doc_height - 170) * 0.7);
   $(".list-area").height((doc_height - 230) * 0.3);
   $(".list-area.link, .list-area.tags").height((doc_height - 170) * 0.7);

   doc_width = $(document).width();
   $(".row-fluid .span4").width((doc_width - 86) / 3);
   $(".row-fluid .span2").width((doc_width - 55) / 6);
   $(".row-fluid .span10").width((doc_width - 55) * 5 / 6);

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
            } else {
               // login failed
               $("#login_fail_msg").show();
            }
         }
      );
   });
});
