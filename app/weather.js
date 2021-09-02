const API_KEY = "47f9711a2db49b4ee0bec513face8f0d";

const queryInput = document.querySelector("#query");
const searchBtn = document.querySelector(".btn");

searchBtn.addEventListener("click", (e) => {
  const q = queryInput.value;
  if (!q || q === "") return;

  console.log(q);
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
}
