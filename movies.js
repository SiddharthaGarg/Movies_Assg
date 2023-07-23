const apiKey = "b834510";
const moviesPerPage = 10;
let currentPage = 1;
let totalResults = 0;
let searchText = "";

const searchInput = document.querySelector(".search-bar");
const displaySearchList = document.querySelector(".fav-container");

window.addEventListener("load", (e) => {
  fetch("http://www.omdbapi.com/?s=Batman&apikey=b834510")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayMovieList(data.Search);
    });
});

searchInput.addEventListener("input", (e) => {
  searchText = e.target.value;
  currentPage = 1; // Reset to the first page when searching
  findMovies(searchText, currentPage);
});

// Function to fetch movies from the OMDB API
async function fetchMovies(searchText, page) {
  const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchText}&page=${page}`;
  const response = await fetch(apiUrl);
  let data = [];
  if (response.status === 200) {
    data = await response.json();
  }
  return data;
}
async function findMovies(searchText, page) {
  //   const data = await fetchMovies(searchText, currentPage);
  const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchText.trim()}&page=${page}`;
  const response = await fetch(apiUrl);

  if (response.status === 200) {
    const data = await response.json();
    if (data) {
      console.log(data);
      totalResults = data.totalResults;
      console.log(totalResults);
      const moviesData = data.Search;
      if (moviesData) {
        console.log(moviesData);
        displayMovieList(moviesData);
      }

      updatePagination();
    } else console.log("Error");
  }
}
// To handle pagination
function updatePagination() {
  const paginationDiv = document.querySelector(".pagination");
  const totalPages = Math.ceil(totalResults / moviesPerPage);

  paginationDiv.innerHTML = `
        <button ${currentPage === 1 ? "disabled" : ""} onclick="goToPage(${
    currentPage - 1
  })">Prev</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button ${
          currentPage === totalPages ? "disabled" : ""
        } onclick="goToPage(${currentPage + 1})">Next</button>
    `;
}

function goToPage(page) {
  currentPage = page;
  findMovies(searchText, currentPage);
}

async function displayMovieList(movies) {
  var output = "";
  for (i of movies) {
    var img = "";
    if (i.Poster != "N/A") {
      img = i.Poster;
    } else {
      img = "images/blank-poster.webp";
    }
    var id = i.imdbID;

    output += `

        <div class="fav-item">
            <div class="fav-poster">
            <a href="moviedetails.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name"><a href="moviedetails.html?id=${id}">${i.Title}</a></p>
                        <p class="fav-movie-rating"><a href="moviedetails.html?id=${id}">${i.Year}</a></p>
                    </div>
                </div>
            </div>
        </div>

       `;
  }

  document.querySelector(".fav-container").innerHTML = output;
  console.log("here is movie list ..", movies);
}

async function singleMovie() {
  var urlQueryParams = new URLSearchParams(window.location.search);
  var id = urlQueryParams.get("id");
  console.log(id);
  const url = `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`;
  const res = await fetch(`${url}`);
  const data = await res.json();
  console.log(data);
  console.log(url);

  var output = `

    <div class="movie-poster">
        <img src=${data.Poster} alt="Movie Poster">
    </div>
    <div class="movie-details">
        <div class="details-header">
            <div class="dh-ls">
                <h2>${data.Title}</h2>
            </div>
        </div>
        <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                    style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
        <ul class="details-ul">
            <li><strong>Actors: </strong>${data.Actors}</li>
            <li><strong>Director: </strong>${data.Director}</li>
            <li><strong>Writers: </strong>${data.Writer}</li>
        </ul>
        <ul class="details-ul">
            <li><strong>Genre: </strong>${data.Genre}</li>
            <li><strong>Release Date: </strong>${data.DVD}</li>
            <li><strong>Box Office: </strong>${data.BoxOffice}</li>
            <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
        </ul>
        <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
        <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
            <i class="fa-solid fa-award"></i>
            &thinsp; ${data.Awards}
        </p>

    </div> 
    `;
  document.querySelector(".movie-container").innerHTML = output;
}
