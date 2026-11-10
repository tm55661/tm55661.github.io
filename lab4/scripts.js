
let req = new XMLHttpRequest();

document.getElementById("searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("searchButton").click();
    }
});

document.getElementById("searchButton").addEventListener("click", function() {
    let city = document.getElementById("searchInput").value;
    let apiKey = "158343023bd22ea4f96756f0ca234545";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    req.open("GET", url, true);

    let promise = new Promise((resolve, reject) => {
      req.onload = function() {
        if (req.status >= 200 && req.status < 300) {
          resolve(req.response);
        } else {
          reject({
            status: req.status,
            statusText: req.statusText
          });
        }
      };
      req.onerror = function() {
        reject({
          status: req.status,
          statusText: req.statusText
        });
      };
    });

    req.send()

    promise.then((response) => {
      let data = JSON.parse(response);
      console.log(data);

      document.getElementById("currentWeather").innerHTML = `
            <h3>${data.name}</h3>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
            <h2>${Math.round(data.main.temp)} °C</h2>
            <p>${data.weather[0].description}</p>
            <p>Feels like: ${Math.round(data.main.feels_like)} °C</p>
            <p>Humidity: ${data.main.humidity}%</p>
        `;

    }).catch((error) => {
      console.error("Error:", error.statusText);
      document.getElementById("currentWeather").innerHTML = `Error: ${error.statusText}`;
    });


    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(forecastUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data)

        let forecast = document.getElementById("forecast");
        forecast.innerHTML = "";

        data.list.forEach((item) => {
          forecast.innerHTML += `
              <div class="forecast-card">
                  <p>${item.dt_txt}</p>
                  <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather icon">
                  <h3>${Math.round(item.main.temp)} °C</h3>
                  <p>${item.weather[0].description}</p>
              </div>`;
        });

      }).catch((error) => {
        console.error("Error:", error);
        document.getElementById("forecast").innerHTML = `Error: ${error}`;
      });
});
