
//api key => e083dd14b86727c4cdde94abc02df2a9
// to run the code tailwind npx tailwindcss -i ./input.css -o ./output.css --watch

const apiKey = config.apiKey;

async function getWeather() {
    //const apiKey = 'e083dd14b86727c4cdde94abc02df2a9'; // replace with your API key
    const city = document.getElementById('cityName').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        document.getElementById('output').innerText = 
          `Weather in ${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;
        
      } else {
        document.getElementById('output').innerText = `Error: ${data.message}`;
      }
    } catch (error) {
      document.getElementById('output').innerText = 'Failed to fetch weather data.';
    }
  }

  function show(){
    console.log("welcome to api")
    const cityData=document.getElementById("cityName");
    console.log(cityData.value)
    document.getElementById("output").appendChild(cityData.value)
  }
//-------------------------------------------current function------------------------------------------------
  async function getCurr() {
    //const apiKey = 'e083dd14b86727c4cdde94abc02df2a9'; // API key
    const city = document.getElementById('cityName').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        /*document.getElementById('output').innerText = 
          `Weather in ${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;*/
        document.getElementById('Temperature').innerHTML=` ${data.main.temp}<sup>°C</sup>`;
        document.getElementById('Humidity').innerHTML=`Humidity is ${data.main.humidity}<sup>°C</sup>`;
        document.getElementById('Wind').innerHTML=`Wind speed is ${data.wind.speed}`;
        getForecast()
      } else {
        document.getElementById('output').innerText = `Error: ${data.message}`;
      }
    } catch (error) {
      document.getElementById('output').innerText = 'Failed to fetch weather data.';
    }
  }

  
  function storeCity(city) {
  if (!city) return;

  let cities = JSON.parse(sessionStorage.getItem('cities') || '[]');

  if (!cities.includes(city)) {
    cities.push(city);
    sessionStorage.setItem('cities', JSON.stringify(cities));
    updateDatalist(cities);
  }
}

function updateDatalist(cities) {
  const datalist = document.getElementById('cityOptions');
  datalist.innerHTML = cities.map(city => `<option value="${city}">`).join('');
}
//-----------current location functionality -------------------------------------
//const apiKey = 'e083dd14b86727c4cdde94abc02df2a9'; // Replace with your key

function getCurrentPosition() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(success, error);

  function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
   // const apiKey = 'e083dd14b86727c4cdde94abc02df2a9';

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(forecastUrl)
      .then(res => res.json())
      .then(data => {
        if (data.cod !== "200") {
          document.getElementById('forecast').innerHTML = `<p>Error: ${data.message}</p>`;
          return;
        }

        const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        for (let i = 0; i < 5; i++) {
          const item = dailyData[i];
          const date = new Date(item.dt_txt).toDateString();
          const temp = item.main.temp;
          const desc = item.weather[0].description;
          const icon = item.weather[0].icon;
          const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

          const card = document.getElementById(`card-${i}`);
          card.innerHTML = `
            <h3 class="text-lg font-bold">${date}</h3>
            <img src="${iconUrl}" alt="${desc}" class="mx-auto">
            <p class="text-xl font-semibold">${temp}°C</p>
            <p class="capitalize">${desc}</p>
          `;
        }
      });
  }

  function error() {
    alert("Unable to retrieve your location.");
  }
}
  
//--------------- 5 day forecast data ----------------------------------------
  async function getForecast() {
      const city = document.getElementById('cityName').value.trim();
      //const apiKey = 'e083dd14b86727c4cdde94abc02df2a9'; //  OpenWeatherMap API key

      if (!city) {
        alert('Please enter a city name.');
        return;
      }
      sessionStorage.setItem('lastCity', city);
      storeCity(city)
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== "200") {
          document.getElementById('forecast').innerHTML = `<p>Error: ${data.message}</p>`;
          return;
        }

        const forecastContainer = document.getElementById('forecast');
        //forecastContainer.innerHTML = ''; // clear previous data

        const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        for (let i = 0; i < 5; i++) {
          const item = dailyData[i];
          if (!item) continue; // in case there's less than 5

          const date = new Date(item.dt_txt).toDateString();
          const temp = item.main.temp;
          const desc = item.weather[0].description;
          const icon = item.weather[0].icon;
          const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

          const card = document.getElementById(`card-${i}`);
          card.innerHTML = `
            <h3>${date}</h3>
            <img src="${iconUrl}" alt="${desc}">
            <p>${temp}°C</p>
            <p>${desc}</p>
          `;
        }


      } catch (error) {
        document.getElementById('forecast').innerHTML = '<p>Failed to fetch forecast data.</p>';
      }
    }

window.onload = () => {
  const cities = JSON.parse(sessionStorage.getItem('cities') || '[]');
  updateDatalist(cities);
};
