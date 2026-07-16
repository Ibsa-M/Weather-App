const weatherForm = document.querySelector('.weatherForm');
const cityCountryInput = document.querySelector('.city-country-input');
const card = document.querySelector('.card');
const apiKey = 'PU2A8NQTBL'; // Replace with your actual API key


weatherForm.addEventListener('submit', async event => {
  event.preventDefault();
  const cityCountry = cityCountryInput.value.trim();
  
  if (cityCountry) {
    try {
      const weatherData = await getweatherInfo(cityCountry);
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error.message || 'Failed to fetch weather data');
    }
  } else {
    displayError('Please enter a city or country');
  }
});

async function getweatherInfo(cityCountry) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(cityCountry)}?unitGroup=metric&contentType=json&key=${apiKey}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City or country not found. Please check your spelling.');
      } else if (response.status === 403) {
        throw new Error('API key is invalid or expired.');
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    console.log('Weather Data:', data);
    return data;
    
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
}

function displayWeatherInfo(weatherData) {
  // Clear previous content
  card.textContent = "";
  card.style.display = "flex";
  card.style.flexDirection = "column";
  card.style.alignItems = "center";
  card.style.padding = "20px";
  
  // Extract data from the response
  const location = weatherData.resolvedAddress || weatherData.address || "Unknown Location";
  const currentConditions = weatherData.currentConditions || weatherData.days?.[0] || {};
  const temp = currentConditions.temp || "N/A";
  const conditions = currentConditions.conditions || "No conditions available";
  const humidity = currentConditions.humidity || "N/A";
  const windspeed = currentConditions.windspeed || "N/A";
  const description = weatherData.description || `Weather in ${location}`;
  
  // Create and display elements
  const cityName = document.createElement("h1");
  cityName.textContent = location;
  cityName.classList.add("city-name");
  
  const tempDisplay = document.createElement("p");
  tempDisplay.textContent = `🌡️ Temperature: ${temp}°C`;
  tempDisplay.classList.add("temp-display");
  
  const descDisplay = document.createElement("p");
  descDisplay.textContent = description;
  descDisplay.classList.add("desc-display");
  
  const conditionsDisplay = document.createElement("p");
  conditionsDisplay.textContent = `☁️ ${conditions}`;
  conditionsDisplay.classList.add("conditions-display");
  
  const humidityDisplay = document.createElement("p");
  humidityDisplay.textContent = `💧 Humidity: ${humidity}%`;
  humidityDisplay.classList.add("humidity-display");
  
  const windDisplay = document.createElement("p");
  windDisplay.textContent = `💨 Wind Speed: ${windspeed} km/h`;
  windDisplay.classList.add("wind-display");
  
  // Append all elements to card
  card.appendChild(cityName);
  card.appendChild(tempDisplay);
  card.appendChild(descDisplay);
  card.appendChild(conditionsDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(windDisplay);
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("displayError");

  card.textContent = "";
  card.style.display = "flex";
  card.style.justifyContent = "center";
  card.style.alignItems = "center";
  card.style.padding = "20px";
  card.appendChild(errorDisplay);
}