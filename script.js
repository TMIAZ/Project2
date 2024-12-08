// Putting used APIs into const variables
const teatherAreas = "https://www.finnkino.fi/xml/TheatreAreas/";
const schedule = "https://www.finnkino.fi/xml/Schedule/";

// Function for selecting theater
function selectTheater() {
    
    // Creating an XMLHttpRequest
    var xmlhttp = new XMLHttpRequest();

    // Open the request with the GET method to fetch data from Finnkino API
    xmlhttp.open("GET", teatherAreas, true);
    
    // Sending the request
    xmlhttp.send();

    // Making sure the request was successful
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            
            // Saving response into variable
            var xmlDoc = xmlhttp.responseXML;
            
            // Saving teather-tag data into variable
            var theaters = xmlDoc.getElementsByTagName("TheatreArea");
            
            // Saving teaththerSelector-id data into variable
            var selector = document.getElementById("theater-select");
            
            // Using for loop to iterate the array
            for (var i = 0; i < theaters.length; i++) {
                
                // Fetching theater Id-tag data and their childnodes
                var theaterId = theaters[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue;

                // Fetching theater Name-tag data and their childnodes
                var theaterName = theaters[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
                
                /* Removing theater id = 1029 = "valitse alue/teatteri"
                from the list to make the option list look better.
                */
                if (theaterId === "1029") continue;

                // Creating a new option element to be added later in select element
                var option = document.createElement("option");

                // Setting the ID ("values") and Teather names ("texts") to options
                option.value = theaterId;
                option.text = theaterName;
                
                // Adds options to selector
                selector.appendChild(option);
            }
        }
    };
}

// Function for finding movies and their details for selected theater
function findMoviesByTheater(theaterId) {
    
    // Creating new variable for url that fetches the shows and theaters
    var movieUrl = schedule + "?area=" + theaterId;

    // Creating an XMLHttpRequest
    var xmlhttp = new XMLHttpRequest();

    // Open the request with the GET method to fetch data from Finnkino API
    xmlhttp.open("GET", movieUrl, true);

    // Sending the request
    xmlhttp.send();

    // Making sure the request was successful
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            // Saving response into variable
            var xmlDoc = xmlhttp.responseXML;
            
            // Saving show-tag data into variable
            var shows = xmlDoc.getElementsByTagName("Show");
            
            // Saving movies-id data into variable
            var moviesContainer = document.getElementById("movies");

            // Clears the previous movie cards
            moviesContainer.innerHTML = "";

            // Using for loop to iterate the array
            for (var i = 0; i < shows.length; i++) {

                // Fetching titles and their childnodes
                var title = shows[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue;
                
                // Checks if there are movie images and fetches them and their childnodes
                var image = shows[i].getElementsByTagName("EventSmallImagePortrait")[0]?.childNodes[0]?.nodeValue || "";
                
                // Fetching showtimes and their childnodes
                var showtime = shows[i].getElementsByTagName("dttmShowStart")[0]?.childNodes[0]?.nodeValue;
                
                // Fetching theaters and their childnodes
                var theaterName = shows[i].getElementsByTagName("Theatre")[0].childNodes[0].nodeValue;

                // Creating new div for movie cards to be shown
                var movieCard = document.createElement("div");
                
                // Gives a class name for added div
                movieCard.className = "movie-card";

                /* Adding the movie details into the movie card:
                adds an image
                adds a title
                adds a showtime and changes the date format to the format used in Finland
                adds a theatre
                */
                movieCard.innerHTML = `
                    <img src="${image}" alt="${title}">
                    <h3>${title}</h3>
                    <p>Showtime: ${new Date(showtime).toLocaleString("fi-FI")}</p>
                    <p>Theater: ${theaterName}</p>
                `;

                // Adds movies to container
                moviesContainer.appendChild(movieCard);
            }
        }
    };
}

// Function for searching movies
function searchMovies() {
   
    // Saves the user input
    var movieName = document.getElementById("movie-search").value.trim();
    
    // Alerts if the user doesn't write anything
    if (!movieName) return alert("Please enter a movie name.");

    // Creating an XMLHttpRequest
    var xmlhttp = new XMLHttpRequest();
    
    /* Creating new variable for url that fetches the theaters and movies,
    uses also encodeURICompinent to handle the user input
    */
    var movieUrl = schedule + "?title=" + encodeURIComponent(movieName); // Hae elokuva nimellä
    
    // Open the request with the GET method to fetch data from Finnkino API
    xmlhttp.open("GET", movieUrl, true);
    
    // Sending the request
    xmlhttp.send();

    // Making sure the request was successful
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            
            // Saving response into variable
            var xmlDoc = xmlhttp.responseXML;
            
            // Saving show-tag data into variable
            var shows = xmlDoc.getElementsByTagName("Show");

            // Saving movies-id data into variable
            var moviesContainer = document.getElementById("movies");

            // Clears previous searches
            moviesContainer.innerHTML = "";

            // Using for loop to iterate the array
            for (var i = 0; i < shows.length; i++) {

                // Fetching title-tag data and their childnodes
                var title = shows[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue;

                // Makes sure the title matches with the user input
                if (!title.toLowerCase().includes(movieName.toLowerCase())) continue;

                // Checks if there are movie images and fetches them and their childnodes
                var image = shows[i].getElementsByTagName("EventSmallImagePortrait")[0]?.childNodes[0]?.nodeValue || "";
                
                // Fetching showtimes and their childnodes
                var showtime = shows[i].getElementsByTagName("dttmShowStart")[0]?.childNodes[0]?.nodeValue;
                
                // Fetching theaters and their childnodes
                var theater = shows[i].getElementsByTagName("Theatre")[0].childNodes[0].nodeValue;

                // Creating new div for movie cards to be shown
                var movieCard = document.createElement("div");
                
                // Gives a class name for added div
                movieCard.className = "movie-card";
                
                /* Adding the movie details into the movie card:
                adds an image
                adds a title
                adds a showtime and changes the date format to the format used in Finland
                adds a theatre
                */
                movieCard.innerHTML = `
                    <img src="${image}" alt="${title}">
                    <h3>${title}</h3>
                    <p>Showtime: ${new Date(showtime).toLocaleString("fi-FI")}</p>
                    <p>Teatteri: ${theater}</p>
                `;

                // Adds movies to container
                moviesContainer.appendChild(movieCard);
            }
        }
    };
}

// Initializes the page once content is loaded
document.addEventListener("DOMContentLoaded", function () {
    
    // Runs the selectTheater function
    selectTheater();

    // Event listener for theater selections
    document.getElementById("theater-select").addEventListener("change", function () {
        var theaterId = this.value;
        
        // Finds movies for selected theater
        if (theaterId) {
            findMoviesByTheater(theaterId);
        }
    });

    // Event listener for movie searchs
    document.getElementById("movie-search-btn").addEventListener("click", searchMovies);
});