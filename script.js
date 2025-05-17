// File: script.js
// This is your main JavaScript file

// Option 1: For local development with config.js approach
let apiKey;

// Try to get the API key from config.js (will work locally)
try {
  apiKey = '187774e2bc818aca26309836cec5f170';
} catch (e) {
  console.error("Config file not found or API key not set");
  apiKey = ''; // Empty fallback
}

const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon');
const weatherElement = document.querySelector('.weather');

// Hide weather info initially
weatherElement.style.display = "none";

async function checkWeather(city) {
    try {
        if (!city) {
            alert("Please enter a city name");
            return;
        }
        
        if (!apiKey) {
            displayApiKeyError();
            return;
        }
        
        // Show loading indicator
        document.getElementById('loading').style.display = "block";
        weatherElement.style.display = "none";
        
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        
        // Hide loading indicator regardless of result
        document.getElementById('loading').style.display = "none";
        
        if (!response.ok) {
            if (response.status === 404) {
                showError("City not found. Please check the spelling.");
            } else {
                showError(`Error: ${response.status}`);
            }
            return;
        }
        
        const data = await response.json();
        console.log("Weather data received");
        
        // Update UI with data
        document.querySelector('.city').innerHTML = data.name;
        document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '°C';
        document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
        document.querySelector('.wind').innerHTML = data.wind.speed + ' Km/h';

        // Update weather icon
        if(data.weather[0].main == 'Clouds'){
            weatherIcon.src = 'images/clouds.png';
        }
        else if(data.weather[0].main == 'Clear'){
            weatherIcon.src = 'images/clear.png';
        }
        else if(data.weather[0].main == 'Rain'){
            weatherIcon.src = 'images/rain.png';
        }
        else if(data.weather[0].main == 'Drizzle'){
            weatherIcon.src = 'images/drizzle.png';
        }
        else if(data.weather[0].main == 'Mist'){
            weatherIcon.src = 'images/mist.png';
        }
        
        // Show weather info
        weatherElement.style.display = "block";
        clearError();
        
    } catch (error) {
        console.error("Error:", error);
        showError("Failed to fetch weather data. Please try again.");
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    weatherElement.style.display = "none";
}

function clearError() {
    document.getElementById('error-message').style.display = "none";
}

function displayApiKeyError() {
    showError("API key not configured. Please set up your API key.");
}

searchBtn.addEventListener('click', () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        checkWeather(searchBox.value);
    }
});
