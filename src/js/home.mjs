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
    svgElement.innerHTML = ''; // Clear previous content

    const article = articles[index];
    if (!article) return; // Skip if not enough articles

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

