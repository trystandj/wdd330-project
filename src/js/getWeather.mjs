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
  const spinner = document.getElementById("weather-spinner");
  try {
      spinner.classList.remove("hidden");
spinner.classList.add("visible");
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
      rain: data.daily.precipitation_sum[0] 
      
    };
    
  } catch (err) {
    console.error(err);
    return null;
  }finally {
     spinner.classList.remove("visible");
spinner.classList.add("hidden");
   
  }
  
}

async getForecast() {
  try {
    const position = await this.getLocation();
    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m&temperature_unit=fahrenheit`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Bad Response");

    const data = await res.json();
    const times = data.hourly.time;
    const temps = data.hourly.temperature_2m;

    const days = {};

    
    times.forEach((timestamp, index) => {
      const date = timestamp.split('T')[0];
      if (!days[date]) {
        days[date] = [];
      }
      days[date].push(temps[index]);
    });

    
    const forecast = Object.entries(days)
      .slice(0, 7)
      .map(([date, temps]) => {
        const min = Math.min(...temps);
        const max = Math.max(...temps);
        const avg = (
          temps.reduce((sum, t) => sum + t, 0) / temps.length
        ).toFixed(1);

        return {
          date,
          minTemp: min,
          maxTemp: max,
          avgTemp: parseFloat(avg)
        };
      });

    return forecast;
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
