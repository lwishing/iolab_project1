$(document).ready(function() {
   $("#login-modal").hide();
   $("#login-modal").modal("show");

   doc_height = $(document).height();
   $(".row-fluid.upper").height(doc_height * 0.3);
   $(".row-fluid.lower").height(doc_height * 0.7 - 50);
   $(".list-area").height(doc_height * 0.3 - 70);
   $(".list-area.link, .list-area.tags").height(doc_height * 0.7 - 120);
});
