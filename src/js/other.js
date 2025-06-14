import {
  loadHeaderFooter,
  getLocalStorage,
  
  RemoveSaveArticleListener,
  displaySavedArticles,
} from "./utils.mjs";
import FetchWeather from "./getWeather.mjs";

loadHeaderFooter();

let articlesVisible = false;
let weatherVisible = false;
let subVisible = false;

document.addEventListener("DOMContentLoaded", () => {
  const viewButton = document.getElementById("displayArticles");
  const container = document.getElementById("news-container");
  const weatherButton = document.getElementById("displayWeather");
  const weatherContainer = document.getElementById("weather-row-other");
  const subButton = document.getElementById("subscriptionBTN");
  const subscriptionContainer = document.getElementById("subscription");

  // Articles Toggle
  viewButton.addEventListener("click", () => {
    const articles = getLocalStorage("saved-articles") || [];

    if (articlesVisible) {
      container.innerHTML = "";
      articlesVisible = false;
      viewButton.textContent = "Show Saved Articles";
    } else {
      displaySavedArticles(articles);
      articlesVisible = true;
      viewButton.textContent = "Hide Saved Articles";
    }
  });

  // Weather Toggle
  weatherButton.addEventListener("click", () => {
    if (weatherVisible) {
      weatherContainer.innerHTML = "";
      weatherVisible = false;

      weatherButton.textContent = "Show Weather";
    } else {
      if (subVisible) {
        subscriptionContainer.innerHTML = "";
        subVisible = false;
        subButton.textContent = "Sign Up!";
      }
      weatherVisible = true;

      main();
      

      weatherButton.textContent = "Hide Weather";
    }
  });

  // Subscription Toggle
  subButton.addEventListener("click", () => {
    if (subVisible) {
      subscriptionContainer.innerHTML = "";
      subVisible = false;
      weatherVisible = true;
      subButton.textContent = "Sign Up!";
    } else {
      if (weatherVisible) {
        weatherContainer.innerHTML = "";
        weatherVisible = false;
        weatherButton.textContent = "Show Weather";
      }
      displaySubscribeForm();
      subVisible = true;

      subButton.textContent = "Hide Sign Up";
    }
  });

  // Remove Saved Article
  container.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-btn")) {
      const index = parseInt(event.target.getAttribute("data-index"));
      RemoveSaveArticleListener(index);

      const articles = getLocalStorage("saved-articles") || [];
      displaySavedArticles(articles);
    }
  });
});

const weather = new FetchWeather();

async function main() {
  const forecast = await weather.getForecast();
  if (forecast) {
    showCurrentWeather(forecast);
  }
}

function showCurrentWeather(forecast) {
  const container = document.querySelector(".weather-row-other");
  container.innerHTML = "";

  forecast.forEach((day) => {
    const col = document.createElement("div");
    col.className = "text-center";

    col.innerHTML = `
      <div class="card p-3 shadow-sm rounded-3 weathercard">
        <h4 class="fw-bold">${day.date}</h4>
        <img src="../images/cloud.png" width="100px" height="100px" class="rounded-circle my-2" alt="Weather Icon">
        <p class="lead mb-1">Avg: ${day.avgTemp} °F</p>
        <p class="mb-1">High: ${day.maxTemp} °F</p>
        <p class="mb-1">Low: ${day.minTemp} °F</p>
      </div>
    `;

    container.appendChild(col);
  });
}

function displaySubscribeForm() {
  const container = document.getElementById("subscription");

  container.innerHTML = `
  <div
        class="d-flex justify-content-center align-items-center"
        style="margin-top: 80px"
      >
        <h2>Subscribe</h2>
      </div>
    <section class="subscribe">
    
      <form class="row g-3">
        <div class="col-md-6">
          <label for="inputName4" class="form-label">Name</label>
          <input type="text" class="form-control" id="inputName4" />
        </div>
        <div class="col-md-6">
          <label for="inputEmail4" class="form-label">Email</label>
          <input type="email" class="form-control" id="inputEmail4" />
        </div>
        <div class="subscribe-button">
          <a href="#" class="btn btn-outline-dark" id="subscribeBtn">Subscribe</a>
        </div>
      </form>
    </section>
  `;

  document
    .getElementById("subscribeBtn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      const name = document.getElementById("inputName4").value.trim();
      const email = document.getElementById("inputEmail4").value.trim();

      if (name && email) {
        alert(`Subscribed successfully!\nName: ${name}\nEmail: ${email}`);
      } else {
        alert("Please enter both name and email.");
      }
    });
}
