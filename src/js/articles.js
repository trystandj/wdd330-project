import { loadHeaderFooter, getParam } from './utils.mjs';
import { changeHeadlineSlider, HeadLineImage } from './home.mjs';
import fetchNews from './getNews.mjs';

loadHeaderFooter();
linkParam(); 

window.addEventListener('DOMContentLoaded', async () => {
  let category = getParam("category");

  // If no category is set in the URL, set it to "general" and reload the page
  if (!category) {
    const url = new URL(window.location);
    url.searchParams.set("category", "general");
    window.location.href = url; // This reloads the page with the "general" category
    return; // Stop further execution so we don’t fetch before reload
  }

  const newsFetcher = new fetchNews();
  try {
    const articles = await newsFetcher.getCategory(category);
    displayArticles(articles);
  } catch (err) {
    console.error("Failed to load articles:", err);
  }
});



function linkParam() {
    
  document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); 
      const category = this.dataset.category;

      const url = new URL(window.location);
      url.searchParams.set("category", category);
      window.location.href = url;
    });
  });
}



function displayArticles(articles) {
  const container = document.getElementById('news-container');
  container.innerHTML = '';

  articles.forEach((article) => {
    const card = document.createElement('div');
    card.className = 'card text-center shadow-sm p-3';
    card.id = 'article-card';
    card.innerHTML = `
      <img
        src="${article.image || '/images/Breaking-News.jpg'}"
        class="card-img-top rounded-circle mx-auto d-block mt-3"
        alt="News Image"
        style="width: 80px; height: 80px; object-fit: cover"
      />
      <div class="card-body">
        <h5 class="card-title fw-bold">${article.title}</h5>
        <p class="text-muted">${article.source.name || 'Unknown Source'}</p>
        <p class="card-text">${article.description || ''}</p>
        <p class="text-muted mb-1">${article.source.url || 'Unknown Author'}</p>
        <p class="text-muted">${new Date(article.publishedAt).toLocaleDateString()}</p>
        <a href="${article.url}" target="_blank" class="btn btn-outline-dark">Read More</a>
      </div>
    `;
    container.appendChild(card);
  });
}
