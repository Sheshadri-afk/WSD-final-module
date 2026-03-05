const API_KEY = import.meta.env.VITE_API_KEY;
var IMG_URL = 'https://image.tmdb.org/t/p/w500'; 

// 1. The Search Logic (Moved into a reusable function)
function executeSearch() {
    let userSearch = document.getElementById('searchbar').value.trim();    
    if (userSearch === ""){
        alert("Please enter a movie name");
        return;
    }
    
    // Fetching the movie
    fetch("https://api.themoviedb.org/3/search/movie?api_key=" + API_KEY + "&query=" + userSearch)
        .then(response => response.json())
        .then(data => displayMovies(data.results))
        .catch(error => console.log("Error:", error));
} 

// 2. Button Click Listener
document.getElementById('myb').addEventListener('click', executeSearch);

// 3. Mobile Keyboard "Enter/Go" Listener
document.getElementById('searchbar').addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevents the page from refreshing
        executeSearch();
    }
});

// Displaying the results
function displayMovies(movieList) {
    let gallery = document.getElementById('gallery');
    gallery.innerHTML = "";
    
    movieList.forEach(function(movie) {
        // Safety check: Only show movies that actually have a poster
        let posterSrc = movie.poster_path ? IMG_URL + movie.poster_path : "https://via.placeholder.com/500x750?text=No+Poster";
        
        // Escape quotes in titles so it doesn't break the onclick function
        let safeTitle = movie.title.replace(/'/g, "").replace(/"/g, "");
        
        let htmlCard = `
            <div class="col-4 col-md-3 movie-card" onclick="getStreamProviders(${movie.id}, '${safeTitle}')" style="cursor: pointer;">
                <img src="${posterSrc}" class="poster-img">
                <p class="movie-title">${movie.title}</p>
            </div>
        `;
        gallery.innerHTML += htmlCard;
    });
}

// Streaming providers redirect
function getStreamProviders(movieId, movieTitle) {
    localStorage.setItem('selectedMovieId', movieId);
    localStorage.setItem('selectedMovieTitle', movieTitle);
    window.location.href = 'results.html';
}

// Make it available globally for the inline onclick
window.getStreamProviders = getStreamProviders;