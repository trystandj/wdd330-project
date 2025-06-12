import { loadHeaderFooter, getLocalStorage, displayArticles, RemoveSaveArticleListener, displaySavedArticles } from './utils.mjs';
import FetchWeather from './getWeather.mjs';

loadHeaderFooter();

let articlesVisible = false; 
let weatherVisible = false; 

document.addEventListener('DOMContentLoaded', () => {
  const viewButton = document.getElementById('displayArticles');
  const container = document.getElementById('news-container');
  const weatherButton = document.getElementById('displayWeather')
  const weatherContainer = document.getElementById('weather-row-other')

  viewButton.addEventListener('click', () => {
    const articles = getLocalStorage('saved-articles') || [];

    if (articlesVisible) {
      container.innerHTML = '';
      articlesVisible = false;
      viewButton.textContent = 'Show Saved Articles';
    } else {
      displaySavedArticles(articles);
      articlesVisible = true;
      viewButton.textContent = 'Hide Saved Articles';
    }
  });


    weatherButton.addEventListener('click', () => {
    
    if (weatherVisible) {
      weatherContainer.innerHTML = '';
      weatherVisible = false;
      weatherButton.textContent = 'Show Weather';
    } else {
      main();
      weatherVisible = true;
      weatherButton.textContent = 'Hide Weather';
    }
  });

  document.getElementById('news-container').addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
      const index = parseInt(event.target.getAttribute('data-index'));
      RemoveSaveArticleListener(index);
      
      const articles = getLocalStorage('saved-articles') || [];
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
  const container = document.querySelector('.weather-row-other');
  container.innerHTML = '';

  forecast.forEach((day) => {
    const col = document.createElement('div');
    col.className = 'text-center'; 

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



