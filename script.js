// === STEP 1: Select DOM Elements ===
// Now using the form ID instead of class
const weatherForm = document.getElementById('weatherForm');
const cityCountryInput = document.getElementById('cityInput');
const card = document.querySelector('.card');
const weatherDisplay = document.getElementById('weatherDisplay');

// Your OpenWeatherMap API key
const apiKey = 'cd91ff862148c91c13af22fe5f21ca55';

// === STEP 2: Event Listener for Form Submit ===
weatherForm.addEventListener('submit', async event => {
  event.preventDefault();
  
  const cityCountry = cityCountryInput.value.trim();
  
  if (cityCountry) {
    try {
      console.log('Fetching weather for:', cityCountry);
      const weatherData = await getweatherInfo(cityCountry);
      console.log('Weather data received:', weatherData);
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error('Error in submit handler:', error);
      displayError(error.message || 'Failed to fetch weather data');
    }
  } else {
    displayError('Please enter a city or country');
  }
});

// === STEP 3: Fetch Weather Data from API ===
async function getweatherInfo(cityCountry) {
  const encodedCity = encodeURIComponent(cityCountry);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${apiKey}`;
  
  console.log('Fetching URL:', url);

  try {
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = '';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || '';
      } catch (e) {
        errorMessage = await response.text();
      }
      
      if (response.status === 404) {
        throw new Error(`City "${cityCountry}" not found. Please check the spelling.`);
      } else if (response.status === 401) {
        throw new Error(`Invalid API key. Please check your API key.`);
      } else if (response.status === 403) {
        throw new Error(`API key is invalid or expired.`);
      } else {
        throw new Error(`Error ${response.status}: ${errorMessage || response.statusText}`);
      }
    }
    
    const data = await response.json();
    console.log('Successfully parsed data:', data);
    return data;
    
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error(`Failed to fetch weather: ${error.message}`);
  }
}

// === STEP 4: Display Weather Information ===
function displayWeatherInfo(weatherData) {
  console.log('Displaying weather info');
  
  // Extract data from API response
  const cityName = weatherData.name || "Unknown City";
  const countryCode = weatherData.sys?.country || "";
  const temp = weatherData.main?.temp || "N/A";
  const humidity = weatherData.main?.humidity || "N/A";
  const weatherDescription = weatherData.weather?.[0]?.description || "No description";
  const iconCode = weatherData.weather?.[0]?.icon || "01d";
  const windSpeed = weatherData.wind?.speed || "N/A";
  
  const tempDisplay = Math.round(temp);
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
  // Clear previous content
  weatherDisplay.innerHTML = "";
  weatherDisplay.style.display = "flex";
  weatherDisplay.style.flexDirection = "column";
  weatherDisplay.style.alignItems = "center";
  weatherDisplay.style.padding = "20px";
  weatherDisplay.style.width = "100%";
  
  // Create and append elements to weatherDisplay
  const cityNameEl = document.createElement("h1");
  cityNameEl.textContent = `${cityName}${countryCode ? `, ${countryCode}` : ''}`;
  cityNameEl.classList.add("city-name");
  
  const iconEl = document.createElement("img");
  iconEl.src = iconUrl;
  iconEl.alt = weatherDescription;
  iconEl.style.width = "80px";
  iconEl.style.height = "80px";
  iconEl.style.margin = "10px 0";
  
  const tempEl = document.createElement("p");
  tempEl.textContent = `🌡️ ${tempDisplay}°C`;
  tempEl.classList.add("temp-display");
  
  const descriptionEl = document.createElement("p");
  const capitalizedDesc = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
  descriptionEl.textContent = capitalizedDesc;
  descriptionEl.classList.add("conditions-display");
  
  const humidityEl = document.createElement("p");
  humidityEl.textContent = `💧 Humidity: ${humidity}%`;
  humidityEl.classList.add("humidity-display");
  
  const windEl = document.createElement("p");
  windEl.textContent = `💨 Wind: ${windSpeed} km/h`;
  windEl.classList.add("wind-display");
  
  // Append all elements to weatherDisplay
  weatherDisplay.appendChild(cityNameEl);
  weatherDisplay.appendChild(iconEl);
  weatherDisplay.appendChild(tempEl);
  weatherDisplay.appendChild(descriptionEl);
  weatherDisplay.appendChild(humidityEl);
  weatherDisplay.appendChild(windEl);
}

// === STEP 5: Display Error Messages ===
function displayError(message) {
  console.error('Displaying error:', message);
  
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("displayError");

  // Clear both card and weatherDisplay
  weatherDisplay.innerHTML = "";
  weatherDisplay.style.display = "flex";
  weatherDisplay.style.justifyContent = "center";
  weatherDisplay.style.alignItems = "center";
  weatherDisplay.style.padding = "20px";
  weatherDisplay.style.minHeight = "100px";
  weatherDisplay.appendChild(errorDisplay);
}