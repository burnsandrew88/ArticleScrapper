$.getJSON("/articles", function(data){
    for(var i = 0 ; i < data.length; i++){
        $("#articles").append("<p data-id'" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].link + "<br />" + data[i].summary + "</p>");
    }
})