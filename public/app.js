// Saving an article to the Database
$(".save-button").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/saved/" + thisId
    }).done(function(data) {
        window.location = "/"
    })
});
// Delete an article
$(".delete-button").on("click", function(err,res) {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId
    }).then(function(data) {
        console.log(data);
        res.render("saved");
    })
});
// Whenever someone clicks the Notes Button, Append the Notes for the Article
$(".notes-button").on("click", function() {
    // Empty the notes from the note section
    $(".notes-display").empty();
    // Save the id from the.notes-display button tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $(".notes-display").append("<h2> Article Id:" + thisId + "</h2>");
        // An input to enter a new title
        $(".notes-display").append("<input id='titleent' name='title' ><br><br>");
        // A textarea to add a new note body
        $(".notes-display").append("<textarea id='bodyent' name='body'></textarea><br><br>");
        // A button to submit a new note, with the id of the article saved to it
        $(".notes-display").append("<button data-id='" + thisId + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleent").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinputent").val(data.note.body);
        }
      });
  });

  // Save Note
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      Data: [{
        // Value taken from title input
        title: $("#titleent").val().trim(),
        // Value taken from note textarea
        body: $("#bodyinputent").val()
      }],
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $(".notes-display").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleent").val("");
    $("#bodyinputent").val("");
  });
  
  
  
  
  