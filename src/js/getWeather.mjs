export default class FetchWeather {
  async getForecast() {
    try {
      const position = await this.getLocation();
      const lat = position.coords.latitude;
      const long = position.coords.longitude;

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m&timezone=auto&temperature_unit=fahrenheit`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Bad Response");

      const data = await res.json();
      return data.hourly; 
    } catch (err) {
      console.error(err);
      return null;
    }
  }

async getCurrent() {
  try {
    const position = await this.getLocation();
    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&hourly=relative_humidity_2m&daily=precipitation_sum&temperature_unit=fahrenheit&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Bad Response");

    const data = await res.json();


    return {
      temperature: data.current_weather.temperature,
      humidity: data.hourly.relative_humidity_2m[0],
      rain: data.daily.precipitation_sum[0] // today's total
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

  getLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  }
}
