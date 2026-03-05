const API_KEY = import.meta.env.VITE_API_KEY;
        var IMG_URL = 'https://image.tmdb.org/t/p/w500'; 

document.getElementById(`myb`).onclick = function(){
        let userSearch = document.getElementById(`searchbar`).value;    
        if (userSearch === ""){
                alert("please enter a movie name");
                return;
        }
        //fetching the movie url
        fetch("https://api.themoviedb.org/3/search/movie?api_key="+ API_KEY + "&query="+userSearch)
        .then(response => response.json())
        .then(data => displayMovies(data.results))
        .catch(Error => console.log("Error:",Error));
        
        } 
        //displaying the url
function displayMovies(movieList){
        let gallery = document.getElementById(`gallery`);
        gallery.innerHTML = "";
        movieList.forEach(function(movie) {
          let fullImageUrl = IMG_URL+ movie.poster_path;  
let htmlCard = `
                        <div class="col-4 col-md-3 movie-card" onclick="getStreamProviders(${movie.id},'${movie.title.replace(/'/g, "")}')">
                            <img src="${fullImageUrl}" class="poster-img">
                            <p class="movie-title">${movie.title}</p>
                        </div>
                    `;

                    
                    gallery.innerHTML += htmlCard;
                });
}

//streaming providers
function getStreamProviders(movieId, movieTitle,) {
        localStorage.setItem('selectedMovieId', movieId);
        localStorage.setItem('selectedMovieTitle', movieTitle);
        window.location.href = 'results.html';
}
window.getStreamProviders = getStreamProviders;