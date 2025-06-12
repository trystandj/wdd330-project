import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

export default class ArticleDetails {
  constructor(articles, articleURL) {
    this.articles = articles; 
    this.articleURL = articleURL; 
    this.article = {};
  }

  async init() {
    this.article = this.findArticleById(this.articleURL);
    if (!this.article) {
      document.getElementById('news-container').textContent = "Article not found.";
      return;
    }

    this.renderArticleDetails();
  }

  findArticleById(url) {
    
    return this.articles.find(article => article.url === url || article.slug === url);
  }

  renderArticleDetails() {
    const container = document.getElementById('news-container');
    container.innerHTML = '';

    const article = this.article;
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
              <small class="text-muted">
                ${article.source?.name || 'Unknown Source'} |
                ${new Date(article.publishedAt).toLocaleDateString()}
              </small>
            </p>
            <p class="card-text">
              <small class="text-muted">${article.source?.url || 'Unknown Source'}</small>
            </p>
            <a href="${article.url}" target="_blank" class="btn btn-sm btn-outline-dark">Read More</a>
          </div>
        </div>
        
      </div>
    `;

    container.appendChild(card);
  }
}
