const API_KEY = import.meta.env.VITE_API_KEY;
var IMG_URL = 'https://image.tmdb.org/t/p/w500';

const movieId = localStorage.getItem('selectedMovieId');
const movieTitle = localStorage.getItem('selectedMovieTitle');

function displayMovieInfo() {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(movie => {
            document.getElementById('title').innerText = movie.title;
            document.getElementById('overview').innerText = movie.overview;
            document.getElementById('poster').src = IMG_URL + movie.poster_path;
            document.getElementById('originalLanguage').innerText = movie.original_language;
            document.getElementById('releaseDate').innerText = movie.release_date;
            document.getElementById(`runtime`).innerText = movie.runtime + " mins";
            document.getElementById(`ratings`).innerText = movie.vote_average;
        })
        .catch(error => console.log("Error:", error));
}

function displayActorInfo() {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`)
        .then(res => res.json())
        .then(actor => {
            document.getElementById(`actors1`).innerText = actor.credits.cast[0].name;
            document.getElementById(`character1`).innerText = actor.credits.cast[0].character;
            let actor1 = IMG_URL + actor.credits.cast[0].profile_path;
            document.getElementById('actor1').src = actor1;
            document.getElementById(`actors2`).innerText = actor.credits.cast[1].name;
            document.getElementById(`character2`).innerText = actor.credits.cast[1].character;
            let actor2 = IMG_URL + actor.credits.cast[1].profile_path;
            document.getElementById('actor2').src = actor2;
            document.getElementById(`actors3`).innerText = actor.credits.cast[2].name;
            document.getElementById(`character3`).innerText = actor.credits.cast[2].character;
            let actor3 = IMG_URL + actor.credits.cast[2].profile_path;
            document.getElementById('actor3').src = actor3;
        })
        .catch(error => console.log("Error:", error));
}

function loadWatchProviders(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('ott-container');
            container.innerHTML = "";

            // Safely get India data
            const india = data.results?.IN || {};
            const list = india.flatrate || india.rent || [];

            // Helper function to build the search link
            const getDirectLink = (providerName, movieTitle) => {
                const safeTitle = encodeURIComponent(movieTitle); 
                
                if (providerName.includes("Netflix")) {
                    return `https://www.netflix.com/search?q=${safeTitle}`;
                } else if (providerName.includes("Amazon Prime") || providerName.includes("Prime Video")) {
                    return `https://www.primevideo.com/search/?phrase=${safeTitle}`;
                } else if (providerName.includes("Hotstar") || providerName.includes("Disney")) {
                    return `https://www.hotstar.com/in/explore?search_query=${safeTitle}`;
                } else if (providerName.includes("Apple TV")) {
                    return `https://tv.apple.com/search?term=${safeTitle}`;
                } else if (providerName.includes("JioCinema")) {
                    return `https://www.jiocinema.com/search?q=${safeTitle}`;
                } else {
                    return `https://www.google.com/search?q=Watch+${safeTitle}+on+${encodeURIComponent(providerName)}`;
                }
            };

            if (list.length === 0) {
                container.innerHTML = "<p>❌ Not currently streaming.</p>";
            } else {
                list.forEach(p => {
                    // Generate the link by calling the function
                    const customLink = getDirectLink(p.provider_name, movieTitle);

                    // Output the HTML
                    container.innerHTML += `
                        <a href="${customLink}" target="_blank" style="text-decoration: none; color: inherit;">
                            <div class="provider-item">
                                <img src="${IMG_URL + p.logo_path}" class="ott-logo">
                                <span class="provider-name">${p.provider_name}</span>
                            </div>
                        </a>`;
                });
            }
        })
        .catch(console.error);
}

displayMovieInfo();
displayActorInfo();
loadWatchProviders(movieId);