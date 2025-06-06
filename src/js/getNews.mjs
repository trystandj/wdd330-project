const apiKey = import.meta.env.VITE_GNEWS_API_KEY;


function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class fetchNews {
  async getBasic() {
    const url = `https://gnews.io/api/v4/top-headlines?lang=en&max=3&token=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.articles;
  }

  async getCategory(category) {
    const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=10&token=${apiKey}`;
    const response = await fetch(url);
    const data = await convertToJson(response);
    return data.articles;
  }
}
