import { loadHeaderFooter, getParam } from './utils.mjs';
import { changeHeadlineSlider, HeadLineImage, getLocalStorage, setLocalStorage, displayArticles } from './utils.mjs';
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

    document.querySelectorAll('.save-article-btn').forEach((btn) => {
      const index = btn.dataset.index;
      btn.addEventListener('click', () => addSaveArticleListener(articles[index]));
    });
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
  container.innerHTML = ''; 

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
    saved => saved.title === article.title
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

    document.querySelector('.definition').textContent = result.meaning.definition;
    document.getElementById('word-box').style.display = 'block';
  });

