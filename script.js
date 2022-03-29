const API_URL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f526d66979faf0ed74f87a21177d0506";

const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API =
  'https://api.themoviedb.org/3/search/movie?api_key=f526d66979faf0ed74f87a21177d0506&query="';

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = "";
let totalPages = 100;

// Get initial moviue
getMovies(API_URL);

async function getMovies(url) {
  lastUrl = url;
  const res = await fetch(url);
  const data = await res.json();
  if (data.results.length !== 0) {
    showMovies(data.results);
    currentPage = data.page;
    nextPage = currentPage + 1;
    prevPage = currentPage - 1;
    totalPages = data.total_pages;
    current.innerText = currentPage;
    if (currentPage <= 1) {
      prev.classList.add("disabled");
      next.classList.remove("disabled");
    } else if (currentPage >= totalPages) {
      prev.classList.remove("disabled");
      next.classList.add("disabled");
    } else {
      prev.classList.remove("disabled");
      next.classList.remove("disabled");
    }

    search.scrollIntoView({ behavior: "smooth" });
  } else {
    main.innerHTML = `<h1 class="no results">No Results Found</h1>`;
  }
}

function showMovies(movies) {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
    
    <img
      src="${IMG_PATH + poster_path}"
      alt="${title}"
    />

    <div class="movie-info">
      <h3>${title}</h3>
      <span class="${getClassByRate(vote_average)}">${vote_average}</span>
    </div>
    <div class="overview">
      <h3>Overview</h3>
      ${overview}
    </div>
  
    `;

    main.appendChild(movieEl);
  });
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const searchTerm = search.value;

  if (searchTerm && searchTerm !== "") {
    getMovies(SEARCH_API + searchTerm);
    search.value = "";
  } else {
    window.location.reload();
  }
});

next.addEventListener("click", function () {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
});

prev.addEventListener("click", function () {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});

function pageCall(page) {
  // let url = API_URL + "&page=" + page;
  // console.log(url);
  // getMovies(url);
  let urlSplit = lastUrl.split("?");
  let queryParams = urlSplit[1].split("&");
  let key = queryParams[queryParams.length - 1].split("=");
  console.log(key);
  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join("&");
    let url = urlSplit[0] + "?" + b;
    getMovies(url);
  }
}
