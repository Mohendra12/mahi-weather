async function getWeather() {
  const city = document.getElementById('cityInput').value;
  const apiKey = 'acee2effd3af35d6d0ac5131e2ff17bc'; // Replace with your actual API key

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod === '404') {
      // If the town is not found, try to get data for the nearest city
      const nearestCity = data.message.split(' ')[0];
      const nearestCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${nearestCity}&units=metric&appid=${apiKey}`;

      const nearestResponse = await fetch(nearestCityUrl);
      const nearestData = await nearestResponse.json();

      updateWeatherInfo(nearestData);
    } else {
      updateWeatherInfo(data);
      updateTime();
    }
  } catch (error) {
    console.log('Error fetching data:', error);
  }
}

function updateWeatherInfo(data) {
  const weatherInfo = document.getElementById('weatherInfo');
  weatherInfo.innerHTML = `
          <h2>${data.name}, ${data.sys.country}</h2>
          <p>${data.weather[0].description}</p>
          <p>Temperature: ${data.main.temp}°C</p>
          <p>Humidity: ${data.main.humidity}%</p>
          <p>Wind Speed: ${data.wind.speed} m/s</p>
          <p>Pressure: ${data.main.pressure} hPa</p>
          <p>Visibility: ${data.visibility / 1000} km</p>
          <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
          <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
      `;
}

function updateTime() {
  const currentTime = new Date();
  let hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // Convert to 12-hour format

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;

  const timeElement = document.getElementById('currentTime');
  timeElement.textContent = `Current Time: ${formattedTime}`;

  setTimeout(updateTime, 1000); // Update time every second
}