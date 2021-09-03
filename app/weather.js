const API_KEY = "47f9711a2db49b4ee0bec513face8f0d";

let ctx = document.getElementById("myChart").getContext("2d");

const queryInput = document.querySelector("#query");
const searchBtn = document.querySelector(".btn");

const dateTimeEl = document.querySelector(".date-time");
const conditionEl = document.querySelector(".condition");
const tempEl = document.querySelector("[data-temp]");
const humidityEl = document.querySelector("[data-humidity]");
const speedEl = document.querySelector("[data-speed]");
const iconEl = document.querySelector("[data-icon]");

const weatherCards = document.querySelector(".weather-cards");
const template = document.querySelector("#template");

let tempDataForCharts = [60, 70, 80, 90];

searchBtn.addEventListener("click", (e) => {
  const query = queryInput.value;
  if (!query || query === "") return;

  getCoords(query);
});

async function getCoords(query) {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`
  );
  const data = await response.json();
  const { lat, lon } = data[0];
  getWeather(lat, lon);
}

async function getWeather(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}`
  );
  const data = await response.json();
  displayData(data);
}

function displayData(data) {
  const dateTime = getDateTime(data.current.dt);
  dateTimeEl.textContent = dateTime;
  tempEl.textContent = Math.floor(data.current.temp);
  humidityEl.textContent = `${data.current.humidity}%`;
  speedEl.textContent = `${data.current.wind_speed} km/j`;
  conditionEl.textContent = data.current.weather[0].main;
  iconEl.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
  displayStats(data.daily);

  populateChartData(data.daily);
}

function displayStats(data) {
  weatherCards.innerHTML = "";
  for (let i = 1; i <= 4; i++) {
    const templateClone = template.content.cloneNode(true);
    const dateTime = getDateTime(data[i].dt).split(",")[2];
    const humidity = data[i].humidity;
    const icon = data[i].weather[0].icon;

    const dayEl = templateClone.querySelector("[data-day]");
    dayEl.textContent = dateTime;

    const dataIcon = templateClone.querySelector("[data-day-icon]");
    dataIcon.src = `http://openweathermap.org/img/wn/${icon}.png`;

    const countEl = templateClone.querySelector("[data-count]");
    countEl.textContent = `${humidity}%`;

    weatherCards.appendChild(templateClone);
  }
  document.querySelector(".weather-card").classList.add("active");
}
function getDateTime(unix_timestamp) {
  let date = new Date(unix_timestamp * 1000);
  const humanDate = date.toLocaleString("en-IN", {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  let separator = humanDate.split(",");
  let finalDate = `${separator[3].split(" ")[1]} ${separator[3]
    .split(" ")[2]
    .toUpperCase()}, ${separator[0]},${separator[1]},${separator[2]}`;
  return finalDate;
}

function populateChartData(data) {
  tempDataForCharts = [];
  let date = [];
  for (let i = 1; i <= 4; i++) {
    let nd = getDateTime(data[i].dt).split(",")[2];
    date.push(nd.trim());
    tempDataForCharts.push(data[i].temp.max);
  }
  generateChart(tempDataForCharts, date);
}

const data = {
  labels: ["today", "03", "04", "05"],
  datasets: [
    {
      data: tempDataForCharts,
      fill: true,
      backgroundColor: "rgba(132, 172, 233, 0.418)",
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};
let myChart = new Chart(ctx, {
  type: "line",
  data: data,
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        display: false,
        beginAtZero: false,
        stepSize: 2,
        grid: {
          display: false,
        },
      },
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
  },
});

function generateChart(updatedData) {
  data.labels = updatedData;
  data.datasets[0].data = updatedData;
  myChart.update();
}

async function getLocation() {
  const response = await navigator.permissions.query({ name: "geolocation" });
  const data = await response;
  if (data.state == "granted") {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Not Supported");
    }
  } else {
    getCoords("london");
  }
}
function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWeather(lat, lon);
}
getLocation();
