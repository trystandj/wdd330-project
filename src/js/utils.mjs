
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}


// load header and footer tempaltes
export async function loadHeaderFooter() {
  // Load the header and footer templates in from the partials using the loadTemplate.
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");
  //Grab the header and footer placeholder elements out of the DOM
  const headerElement = document.querySelector("#header");
  const footerElement = document.querySelector("#footer");
  // Render the header and footer using renderWithTemplate
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams.get(param);
  return category;
}


export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}


export async function changeHeadlineSlider() {
  const nextBtn = document.querySelector(".carousel-control-next");
  const prevBtn = document.querySelector(".carousel-control-prev");
  const items = document.querySelectorAll(".carousel-item");

  let autoSlideInterval;

  function getActiveIndex() {
    return Array.from(items).findIndex(item => item.classList.contains("active"));
  }

  function showNextSlide() {
    const activeIndex = getActiveIndex();
    items[activeIndex].classList.remove("active");
    const nextIndex = (activeIndex + 1) % items.length;
    items[nextIndex].classList.add("active");
  }

  function showPrevSlide() {
    const activeIndex = getActiveIndex();
    items[activeIndex].classList.remove("active");
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    items[nextIndex].classList.add("active");
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      showNextSlide();
    }, 5000);
  }

  nextBtn.addEventListener("click", () => {
    showNextSlide();
    resetAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    showPrevSlide();
    resetAutoSlide();
  });


  resetAutoSlide();
}


export async function HeadLineImage(articles) {
  const items = document.querySelectorAll(".carousel-item");

  items.forEach((container, index) => {

    const svgElement = container.querySelector('svg');
    svgElement.innerHTML = '';

    const article = articles[index];
    if (!article) return; 

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'bd-placeholder-img mb-3');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');



    if (article.image) {
      const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      img.setAttributeNS(null, 'href', article.image);
      img.setAttribute('width', '100%');
      img.setAttribute('height', '100%');
      
      img.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      svg.appendChild(img);
    }

    svgElement.appendChild(svg);
  });
}



export function displayArticles(articles) {
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
            
            alt="News Image"
            style=" object-fit: cover;"
          />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title fw-bold">${article.title}</h5>
            <p>${article.description || ''}</p>
            <p>${article.content || ''}</p>
            <p>
              <small class="text-muted">${article.source.name || 'Unknown Source'} | 
              ${new Date(article.publishedAt).toLocaleDateString()}</small>
            </p>
            <p>
              <small class="text-muted">${article.source.url || 'Unknown Source'}</small>
            </p>
            <a href="${article.url}" target="_blank" class="btn btn-sm btn-outline-dark">Read More</a>
            <button class="btn btn-sm btn-outline-secondary save-article-btn" data-index="${index}">Save Article</button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });}


  
export function displaySavedArticles(articles) {
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
            <p>${article.description || ''}</p>
            <p>${article.content || ''}</p>
            <p>
              <small class="text-muted">${article.source.name || 'Unknown Source'} | 
              ${new Date(article.publishedAt).toLocaleDateString()}</small>
            </p>
            <a href="${article.url}" target="_blank" class="btn btn-sm btn-outline-dark">Read More</a>
            <button class="btn btn-sm btn-outline-danger remove-btn" data-index="${index}">Remove Article</button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}



export function RemoveSaveArticleListener(index) {
  const savedArticles = getLocalStorage('saved-articles') || [];

  if (index >= 0 && index < savedArticles.length) {
    savedArticles.splice(index, 1);
    setLocalStorage('saved-articles', savedArticles);
    alert('Article removed!');
  } else {
    alert('Invalid index.');
  }
}

export function SubscriptionModel(){
    const form = document.getElementById("subscribeForm");
  const modal = document.getElementById("thankYouModal");
  const closeBtn = document.getElementById("closeModal");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (form.checkValidity()) {
      modal.classList.remove("hidden");
      form.reset();
    } else {
      form.reportValidity();
    }
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}