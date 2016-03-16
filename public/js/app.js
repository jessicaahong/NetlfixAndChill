//CLIENT-SIDE JS
//MAIN FUNCTION
// var user = {};

$(function() {
    console.log( "ready!" );

    $("#signup-button").click(function(){
        // $("#signUpModal").modal();
        console.log("no issues with jquery");
    });

    //makes AJAX call to OMDB API and displays top ten movies w/keyword in title
    getMovies();

});

//CREATE LIKE
//newLike is a JSON object that is created in the AJAX request
function addMovieToUsers(event){

  //from the hidden input type in my_profile
  var userID = $('#user-id').attr("user-id");

  event.preventDefault();
  var newMovie = {
    imdbID: event.target.children[0].value,
    userID: userID  //will use req.body.userID to push into users array
  }

  //posting to backend (can view on API LIKES)
  $.ajax({
    type: 'POST',
    url: '/api/users',
    data: newMovie,
    dataType: 'json',
    success: function(newMovie){
      console.log("POSTING TO MOVIES");
    },
    error: function(err) {
      console.log("issue with add movies POST: " + err);
    }
  });

};


//CREATE LIKE
//newLike is a JSON object that is created in the AJAX request
function createLike(event){

  addMovieToUsers(event);

  //from the hidden input type in my_profile
  var userID = $('#user-id').attr("user-id");

  event.preventDefault();
  var newLike = {
    imdbID: event.target.children[0].value,
    userID: userID  //will use req.body.userID to push into users array
  }

  //posting to backend (can view on API LIKES)
  $.ajax({
    type: 'POST',
    url: '/api/likes',
    data: newLike,
    dataType: 'json',
    success: function(newLike){
      console.log("POSTING TO Likes");
    },
    error: function(err) {
      console.log("issue with create likes POST: " + err);
    }
  });

};

//show all likes in the MY LIKES div
function renderLikes(){
  // GETTING LIKES AND RENDERING ON MY LIKES PARTIAL=
  console.log("YO RENDER LIKES ");


  $.ajax({
    type: 'GET',
    url: '/api/likes',
    success: function(likes){
      console.log("LIKES ", likes);
    },
    error: function(err) {
      alert("issue with create likes: " + err);
    }
  });
};


// function to SEARCH FOR MOVIES (searchLikes.hbs template)
function getMovies(){

  //name of entire search form
  var $searchForm = $("#searchForm");
  //where the results will be appended
  var $searchResults = $(".search-results");
  //search term input (title)
  var $searchTerm = $('#searchTerm');
  //submit form to search OMDB API
  $searchForm.on('submit', function(event){
    //prevent from refreshing page
    event.preventDefault();
    //empty previous results
    $searchResults.empty();
    //save form data to variable
    var searchTerm = encodeURI($searchTerm.val());
    //ajax request to GET the movie with the title of the searchTerm
    $.ajax({
      type: 'GET',
      url: "http://www.omdbapi.com/?s=" + searchTerm,
     //v=1 is version 1, t means title
      dataType: 'json', //no data is being passed in
      success: function(result){
        console.log(result);
        var movie = "<div>";
        // iterate over the data result set
        $.each(result.Search, function(index, element) {

          //imdb ID since omdb ID isn't available?
          var imdbID = element.imdbID;

          console.log("IMDB ID ", imdbID);

          //adds a button to each movie (+)
          movie += "<form id='add-like' onsubmit='createLike(event)'>"
                +  "<input class='hidden' type='hidden' value=" + imdbID + " name='like' id=" + imdbID + "></input>"
                +  "<input type='submit' value='+'></input>"
                +  "</form>";
          //if there is no poster URL then it just adds a default image
          if(element.Poster !== "N/A"){
              movie += "<div><img src=" + element.Poster + ">";
          } else {
              movie += "<img src='../images/no-photo-available.jpg'>";
          }
          movie += "<h1>" + element.Title + ", " + element.Year + "</h1>";
        });

        movie += '</div>';

        // insert the html
        $searchResults.append(movie);
      },
      //if theres an error with the AJAX request
      error: function(err){
        console.log("AJAX not working... ", err);
      }
    }); //end of AJAX
    //reset form
    $searchForm[0].reset();
    $searchTerm.focus();
  }); //end of on submit
};//end of getMovies
