// Saving an article to the Database
$("#save-button").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/saved/" + thisId
    }).done(function(data) {
        window.location = "/"
    })
});