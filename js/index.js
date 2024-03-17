"use strict";

(function () {
  const searchKeyword = document.getElementById("search");
  const suggestionsContainer = document.getElementById("card-container");
  const favMoviesContainer = document.getElementById("fav-movies-container");
  const emptyText = document.getElementById("empty-search-text");
  const showFavourites = document.getElementById("favorites-section");
  const emptyFavText = document.getElementById("empty-fav-text");

  let suggestionList = [];
  let favMovieArray = [];

  addToFavDOM();
  showEmptyText();

  searchKeyword.addEventListener("keyup", handleSearch);

  function handleSearch() {
    const search = searchKeyword.value.trim();
    if (search === "") {
      emptyText.style.display = "block";
      suggestionsContainer.innerHTML = "";
      suggestionList = [];
    } else {
      emptyText.style.display = "none";
      fetchAndDisplayMovies(search);
    }
  }

  async function fetchAndDisplayMovies(search) {
    try {
      const data = await fetchMovies(search);
      addToSuggestionContainerDOM(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }

  async function fetchMovies(search) {
    const apiKey = "3ef75d9";
    const url = `https://www.omdbapi.com/?t=${search}&apikey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.status}`);
    }
    return response.json();
  }

  function addToSuggestionContainerDOM(data) {
    if (!suggestionList.some((movie) => movie.Title === data.Title)) {
      suggestionList.push(data);
      const movieCard = createMovieCard(data);
      suggestionsContainer.prepend(movieCard);
    }
  }

  function createMovieCard(data) {
    const movieCard = document.createElement("div");
    movieCard.classList.add("text-decoration");
    movieCard.innerHTML = `
      <div class="card my-2" data-id="${data.Title}">
        <a href="movie.html">
          <img src="${data.Poster !== "N/A" ? data.Poster : "./images/not-found.png"}" class="card-img-top" alt="..." />
          <div class="card-body text-start">
            <h5 class="card-title">
              <a href="movie.html" data-id="${data.Title}">${data.Title}</a>
            </h5>
            <p class="card-text">
              <i class="fa-solid fa-star">
                <span id="rating">&nbsp;${data.imdbRating}</span>
              </i>
              <button class="fav-btn">
                <i class="fa-solid fa-heart add-fav" data-id="${data.Title}"></i>
              </button>
            </p>
          </div>
        </a>
      </div>
    `;
    return movieCard;
  }

  async function handleFavBtn(e) {
    const target = e.target;
    const data = await fetchMovies(target.dataset.id);
    favMovieArray = JSON.parse(localStorage.getItem("favMoviesList")) || [];
    if (!favMovieArray.some((movie) => movie.Title === data.Title)) {
      favMovieArray.push(data);
      localStorage.setItem("favMoviesList", JSON.stringify(favMovieArray));
      addToFavDOM();
    }
  }

  function addToFavDOM() {
    favMoviesContainer.innerHTML = "";
    const favList = JSON.parse(localStorage.getItem("favMoviesList")) || [];
    favList.forEach((movie) => {
      const div = document.createElement("div");
      div.classList.add("fav-movie-card", "d-flex", "justify-content-between", "align-content-center", "my-2");
      div.innerHTML = `
        <img src="${movie.Poster}" alt="" class="fav-movie-poster" />
        <div class="movie-card-details">
          <p class="movie-name mt-3 mb-0">
            <a href="movie.html" class="fav-movie-name" data-id="${movie.Title}">${movie.Title}</a>
          </p>
          <small class="text-muted">${movie.Year}</small>
        </div>
        <div class="delete-btn my-4">
          <i class="fa-solid fa-trash-can" data-id="${movie.Title}"></i>
        </div>
      `;
      favMoviesContainer.prepend(div);
    });
    showEmptyText();
  }

  function showEmptyText() {
    emptyFavText.style.display = favMoviesContainer.innerHTML === "" ? "block" : "none";
  }

  function deleteMovie(name) {
    const favList = JSON.parse(localStorage.getItem("favMoviesList")) || [];
    const updatedList = favList.filter((movie) => movie.Title !== name);
    localStorage.setItem("favMoviesList", JSON.stringify(updatedList));
    addToFavDOM();
  }

  function handleClickListner(e) {
    const target = e.target;
    if (target.classList.contains("add-fav")) {
      handleFavBtn(e);
    } else if (target.classList.contains("fa-trash-can")) {
      deleteMovie(target.dataset.id);
    } else if (target.classList.contains("fa-bars")) {
      showFavourites.style.display = showFavourites.style.display === "flex" ? "none" : "flex";
      document.getElementById("show-favourites").style.color = showFavourites.style.display === "flex" ? "var(--logo-color)" : "#8b9595";
    }
    localStorage.setItem("movieName", target.dataset.id);
  }

  document.addEventListener("click", handleClickListner);
})();
