import { loadHeaderFooter } from "./utils.mjs";
import { changeHeadlineSlider, HeadLineImage } from "./utils.mjs";
import fetchNews from "./getNews.mjs";
import FetchWeather from "./getWeather.mjs";

loadHeaderFooter();

changeHeadlineSlider();

const news = new fetchNews();

document.addEventListener("DOMContentLoaded", async () => {
  const articles = await news.getBasic();
  displayArticles(articles);
  HeadLineImage(articles);
});

function displayArticles(articles) {
  const container = document.getElementById("news-container");
  container.innerHTML = "";

  articles.forEach((article) => {
    const card = document.createElement("div");
    card.className = "card text-center shadow-sm p-3";
    card.id = "article-card";
    card.innerHTML = `
      <img
        src="${article.image || "/images/Breaking-News.jpg"}"
        class="card-img-top rounded-circle mx-auto d-block mt-3"
        alt="News Image"
        style="width: 80px; height: 80px; object-fit: cover"
      />
      <div class="card-body">
        <h5 class="card-title fw-bold">${article.title}</h5>
        <p >${article.source.name || "Unknown Source"}</p>
        <p class="card-text">${article.description || ""}</p>
        <p class=mb-1">${article.source.url || "Unknown Author"}</p>
        <p >${new Date(article.publishedAt).toLocaleDateString()}</p>
        <a href="${article.url}" target="_blank" class="btn btn-outline-dark">Read More</a>
      </div>
    `;

    container.appendChild(card);
  });
}

const weather = new FetchWeather();

async function main() {
  const current = await weather.getCurrent();
  if (current) {
    showCurrentWeather(current);
  }
}

function showCurrentWeather(current) {
  const container = document.querySelector(".weather-row");
  container.innerHTML = "";

  const cardData = [
    {
      title: "Humidity",
      value: `${current.humidity} %`,
      description: "Current relative humidity.",
      Img: "../images/humidity.png",
    },
    {
      title: "Temperature",
      value: `${current.temperature} °F`,
      description: "Current temperature at your location.",
      Img: "../images/cloud.png",
    },
    {
      title: "Rain Today",
      value: `${current.rain} mm`,
      description: "Total expected precipitation today.",
      Img: "../images/breeze.png",
    },
  ];

  cardData.forEach((data) => {
    const col = document.createElement("div");
    col.className = "col-lg-4 text-center";

    col.innerHTML = `
      <img src="${data.Img}" class="bd-placeholder-img rounded-circle" width="140px" height="140px" alt="${data.title}">
      <h2 class="fw-normal">${data.title}</h2>
      <p class="lead">${data.value}</p>
      <p>${data.description}</p>
    `;

    container.appendChild(col);
  });
}

main();


