export async function changeHeadlineSlider() {
  const nextBtn = document.querySelector(".carousel-control-next");
  const prevBtn = document.querySelector(".carousel-control-prev")
  const items = document.querySelectorAll(".carousel-item");

  nextBtn.addEventListener("click", () => {
    const activeIndex = Array.from(items).findIndex(item => item.classList.contains("active"));
    

    items[activeIndex].classList.remove("active");


    const nextIndex = (activeIndex + 1) % items.length;

    
    items[nextIndex].classList.add("active");
  });

    prevBtn.addEventListener("click", () => {
    const activeIndex = Array.from(items).findIndex(item => item.classList.contains("active"));
    
    
    items[activeIndex].classList.remove("active");

    
    let nextIndex;
    if (activeIndex === 0) {
    nextIndex = items.length - 1; 
    } else {
    nextIndex = activeIndex - 1;
    }
    items[nextIndex].classList.add("active");
    
  });
}

