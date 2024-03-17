"use strict";

document.addEventListener("DOMContentLoaded", async function () {
  const title = document.getElementById("title");
  const year = document.getElementById("year");
  const runtime = document.getElementById("runtime");
  const rating = document.getElementById("rating");
  const poster = document.getElementById("poster");
  const plot = document.getElementById("plot");
  const directorsName = document.getElementById("director-names");
  const castName = document.getElementById("cast-names");
  const genre = document.getElementById("genre");

  const movieName = localStorage.getItem("movieName");
  if (movieName) {
    try {
      const movieData = await fetchMovieData(movieName);
      displayMovieData(movieData);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  } else {
    console.error("No movie name found in local storage");
  }

  async function fetchMovieData(movieName) {
    const apiKey = "3ef75d9";
    const url = `https://www.omdbapi.com/?t=${movieName}&type=movie&apikey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch movie data: ${response.status}`);
    }
    return await response.json();
  }

  function displayMovieData(movieData) {
    title.textContent = movieData.Title || "N/A";
    year.textContent = movieData.Year || "N/A";
    runtime.textContent = movieData.Runtime || "N/A";
    rating.textContent = movieData.imdbRating ? `${movieData.imdbRating}/10` : "N/A";
    poster.src = movieData.Poster || "";
    plot.textContent = movieData.Plot || "N/A";
    directorsName.textContent = movieData.Director || "N/A";
    castName.textContent = movieData.Actors || "N/A";
    genre.textContent = movieData.Genre || "N/A";
  }
});
