const apiKey = import.meta.env.VITE_GNEWS_API_KEY;


function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } 
   else {
    throw new Error("Bad Response");
  }
}

export default class fetchNews {
  async getBasic() {
    const url = `https://gnews.io/api/v4/top-headlines?lang=en&max=3&token=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await convertToJson(res);
      return data.articles;
    } catch (error) {
      console.warn("API failed. Using local fallback for basic headlines.");
      const fallback = await fetch("/public/json/example.json");
      const data = await fallback.json();
      
      return data.articles.slice(0, 3);
    }
  }

  async getCategory(category) {
    const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=15&token=${apiKey}`;
    try {
    const response = await fetch(url);
    const data = await convertToJson(response);
    return data.articles;
    } catch (error) {
      console.warn("API failed. Using local fallback for basic headlines.");
      const fallback = await fetch("/public/json/example.json");
      const data = await fallback.json();
      
      return data.articles;
    }
  }
}
