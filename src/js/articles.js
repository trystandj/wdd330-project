import { loadHeaderFooter, getParam } from './utils.mjs';
import { changeHeadlineSlider, HeadLineImage, getLocalStorage, setLocalStorage } from './utils.mjs';
import fetchNews from './getNews.mjs';
import FetchWeather from './getWeather.mjs';
import GetWord from './getWord.mjs';

loadHeaderFooter();
linkParam();
changeHeadlineSlider();


window.addEventListener('DOMContentLoaded', async () => {
  let category = getParam('category');

  if (!category) {
    const url = new URL(window.location);
    url.searchParams.set('category', 'general');
    window.location.href = url;
    return;
  }

  const newsFetcher = new fetchNews();
  try {
    const articles = await newsFetcher.getCategory(category);
    displayArticles(articles);
    HeadLineImage(articles);
  } catch (err) {
    console.error('Failed to load articles:', err);
  }
});

function linkParam() {
  document.querySelectorAll('.category-link').forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const category = this.dataset.category;

      const url = new URL(window.location);
      url.searchParams.set('category', category);
      window.location.href = url;
    });
  });
}

function displayArticles(articles) {
  const container = document.getElementById('news-container');
  container.innerHTML = '';

  articles.forEach((article, index) => {
    const card = document.createElement('div');
    card.className = 'card mb-3 shadow-sm';
    card.style.maxWidth = '100%';

    card.innerHTML = `
      <div class="row g-0">
        <div class="col-md-4 d-flex align-items-center justify-content-center p-2">
          <img
            src="${article.image || '/images/Breaking-News.jpg'}"
            class="img-fluid rounded-start"
            alt="News Image"
            style="height: 200px; width: 200px; object-fit: cover;"
          />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title fw-bold">${article.title}</h5>
            <p class="card-text">${article.description || ''}</p>
            <p class="card-text">${article.content || ''}</p>
            <p class="card-text">
              <small class="text-muted">${article.source.name || 'Unknown Source'} | 
              ${new Date(article.publishedAt).toLocaleDateString()}</small>
            </p>
            <p class="card-text">
              <small class="text-muted">${article.source.url || 'Unknown Source'}</small>
            </p>
            <a href="${article.url}" target="_blank" class="btn btn-sm btn-outline-dark">Read More</a>
            <button class="btn btn-primary btn-sm mt-2 save-article-btn" data-index="${index}">Save Article</button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // ✅ Select all buttons by class, not ID
  document.querySelectorAll('.save-article-btn').forEach((btn) => {
    const index = btn.dataset.index;
    btn.addEventListener('click', () => addSaveArticleListener(articles[index]));
  });
}


const weather = new FetchWeather();

async function main() {
  const current = await weather.getCurrent();
  lookupWord();
  if (current) {
    showCurrentWeather(current);
  }
}

function showCurrentWeather(current) {
  const container = document.querySelector('.weather');
  container.innerHTML = ''; // Clear existing

  const cardData = [
    {
      title: 'Humidity',
      value: `${current.humidity} %`,
      description: 'Current relative humidity.',
      Img: '../images/humidity.png',
    },
    {
      title: 'Temperature',
      value: `${current.temperature} °F`,
      description: 'Current temperature at your location.',
      Img: '../images/cloud.png',
    },
    {
      title: 'Rain Today',
      value: `${current.rain} mm`,
      description: 'Total expected precipitation today.',
      Img: '../images/breeze.png',
    },
  ];

  cardData.forEach((data) => {
    const col = document.createElement('div');

    col.innerHTML = `
    <h2 >${data.title}</h2>
      <img src="${data.Img}" class="bd-placeholder-img rounded-circle" width="70px" height="70px" alt="${data.title}">
      
      <p class="lead">${data.value} ${data.description}</p>
      
    `;

    container.appendChild(col);
  });
}

main();


export function addSaveArticleListener(article) {
  const savedArticles = getLocalStorage('saved-articles') || [];

  const exists = savedArticles.some(
    saved => saved.id === article.id || saved.url === article.url
  );

  if (!exists) {
    savedArticles.push(article);
    setLocalStorage('saved-articles', savedArticles);
    alert('Article saved!');
  } else {
    alert('Article already saved.');
  }
}


async function lookupWord() {
  const input = document.getElementById('wordInput').value.trim();
  if (!input) return;

  const fetcher = new GetWord();
  const result = await fetcher.GetTheWord(input);

  document.querySelector('.word').textContent = result.wordName;
  document.querySelector('.definition').textContent = result.meaning;
  document.getElementById('word-box').style.display = 'block';
}

document
  .getElementById('get-def')
  .addEventListener('click', async function (e) {
    e.preventDefault();

    const input = document.getElementById('wordInput').value.trim();
    if (!input) return;

    const fetcher = new GetWord();
    const result = await fetcher.GetTheWord(input);

    document.querySelector('.definition').textContent = result.meaning;
    document.getElementById('word-box').style.display = 'block';
  });

