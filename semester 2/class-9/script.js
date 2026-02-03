//Take input from user and print it onClick of the button.

const searchInput = document.querySelector("input");
const searchBtn = document.querySelector("#search");

searchBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent form submission and page reload
  // alert("I was clicked")
  const location = searchInput.value.trim();
  
  if (!location) {
    alert("Please enter a location");
    return;
  }
  
  //Call API

  fetchWeather(location).then((data) => {
    console.log("Data is ... ", data);

    //Update DOM

    updateDOM(data);
  }).catch((error) => {
    console.error("Error fetching weather:", error);
    displayError("Failed to fetch weather data. Please try again.");
  });

  searchInput.value = ""; //
});

async function fetchWeather(location) {
  const url = `https://api.weatherapi.com/v1/current.json?key=b715f2a2fc474200a0543150262301&q=${location}&aqi=no`;
  const response = await fetch(url);
  //   console.log(response);

  //error handling

  if (!response.ok) {
    const errorMsg = response.status === 400 ? "Location not found. Please check the spelling." : "Failed to fetch weather data.";
    throw new Error(errorMsg);
  } else {
    const jsonData = await response.json();
    return jsonData;
  }
}

function updateDOM(data) {
// *************1. filter required data**************

const temp = data.current.temp_c;
const location = data.location.name;
const country = data.location.country;
const timeData = data.location.localtime;  
const [date, time] = timeData.split(" ");
const iconUrl = data.current.condition.icon;
const conditionText = data.current.condition.text;

console.log(temp,location,country,date,time,iconUrl,conditionText);

  // **********2. update the dom***********
  
  // Update temperature
  const tempElement = document.querySelector(".temperature");
  tempElement.textContent = `${temp}°C`;
  
  // Update location
  const locationElement = document.querySelector(".location");
  locationElement.textContent = `${location}, ${country}`;
  
  // Update date
  const dateElement = document.querySelector(".date");
  dateElement.textContent = date;
  
  // Update time
  const timeElement = document.querySelector(".time");
  timeElement.textContent = time;
  
  // Update day
  const dayElement = document.querySelector(".day");
  const dayDate = new Date(date);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  dayElement.textContent = days[dayDate.getDay()];
  
  // Update weather icon
  const iconElement = document.querySelector(".icon img");
  iconElement.src = `https:${iconUrl}`;
  iconElement.alt = conditionText;
  
  // Update condition text
  const conditionElement = document.querySelector(".condition");
  conditionElement.textContent = conditionText;
}

function displayError(message) {
  // Check if error element exists, create if not
  let errorElement = document.querySelector(".error-message");
  
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.style.cssText = "color: #ff6b6b; text-align: center; padding: 10px; margin-top: 10px; background: rgba(255,0,0,0.1); border-radius: 8px;";
    
    const weatherContainer = document.querySelector(".weather-container");
    weatherContainer.insertBefore(errorElement, weatherContainer.firstChild);
  }
  
  errorElement.textContent = message;
}
