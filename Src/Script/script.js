const body = document.querySelector("body")
const form = document.getElementById("search");
const input = document.getElementById("city_name");
const weather = document.getElementById("weather");
const errorMsg = document.querySelector("#errorBox")

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cidade = input.value.trim();
    const apiKey = "1424c75b00084e39fb7d635ab5e78523";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cidade)}&appid=${apiKey}&units=metric&lang=pt_br`;

    console.log("Cidade buscada:", cidade); 

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Cidade não encontrada");
        } else {
            errorMsg.classList.remove("show")
            errorMsg.classList.add("hide")
            weather.classList.remove("hide")
            weather.classList.add("show")
        }

        const data = await response.json();
        weather.querySelector(".error")?.remove();

        document.getElementById("search").classList.add("show");

        document.getElementById("title").textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById("temp_value").textContent = `${Math.round(data.main.temp)} °C`;
        document.getElementById("temp_description").textContent = data.weather[0].description;
        document.getElementById("max_temp").textContent = `${Math.round(data.main.temp_max)} °C`;
        document.getElementById("wind").textContent = `${data.wind.speed} km/h`;
        document.getElementById("clouds").textContent = `${data.clouds.all}%`;
        document.getElementById("humidity").textContent = `${data.main.humidity}%`;

        const icon = data.weather[0].icon;
        document.getElementById("temp_img").src = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        if (data.clouds.all >= 50) {
            document.querySelector("body").classList.add("nuvem")
        } else {
            document.querySelector("body").classList.remove("nuvem")
        }

        input.value = "";
    } catch (error) {
        console.log("Cidade não encontrada");

        errorMsg.classList.add("show")
        weather.classList.add("hide")
        setTimeout (() => {
        }, 3000)
            input.value = "";
    }
    
});
