const body = document.querySelector("body")
const form = document.getElementById("search");
const input = document.getElementById("city_name");
const weather = document.getElementById("weather");
const errorMsg = document.querySelector("#errorBox")

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const cidade = input.value.trim();
    const apiKey = "1424c75b00084e39fb7d635ab5e78523";

    console.log("Cidade buscada:", cidade); 

    try {
        const responseWeather = await fetch( 
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cidade)}&appid=${apiKey}&units=metric&lang=pt_br` ); 
            if (!responseWeather.ok) throw new Error("Cidade não encontrada"); 
            const dataWeather = await responseWeather.json();

        document.getElementById("search").classList.add("show");

        document.getElementById("title").textContent = `${dataWeather.name}, ${dataWeather.sys.country}`;
        document.getElementById("temp_value").textContent = `${Math.round(dataWeather.main.temp)} °C`;
        document.getElementById("temp_description").textContent = dataWeather.weather[0].description;
        document.getElementById("max_temp").textContent = `${Math.round(dataWeather.main.temp_max)} °C`;
        document.getElementById("wind").textContent = `${dataWeather.wind.speed} km/h`;
        document.getElementById("clouds").textContent = `${dataWeather.clouds.all}%`;
        document.getElementById("humidity").textContent = `${dataWeather.main.humidity}%`;

        const icon = dataWeather.weather[0].icon;
        document.getElementById("temp_img").src = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        if (dataWeather.clouds.all >= 50) {
            document.querySelector("body").classList.add("nuvem")
        } else {
            document.querySelector("body").classList.remove("nuvem")
        }

        const responseForecast = await fetch( 
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(cidade)}&appid=${apiKey}&units=metric&lang=pt_br`
        );
        const dataForecast = await responseForecast.json();

        const hourContainer = document.getElementById("hourForecast_container")
        hourContainer.innerHTML = "";
        dataForecast.list.slice(0, 5).forEach(item => {
            const div = document.createElement("div")
            div.classList.add("info")
            const hora = new Date(item.dt * 1000).getHours().toString().padStart(2, "0");
            const rainProb = Math.round(item.pop * 100);
            div.innerHTML = ` 
            <h5>${hora}:00</h5> 
            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="clima"> 
            <h5>${Math.round(item.main.temp)} °C</h5> 
            <h5>${rainProb} %</h5>`;
            hourContainer.appendChild(div);
        }); 
            const dayContainer = document.getElementById("dayForecast_container"); 
            dayContainer.innerHTML = "";
            const days = {}; 
            dataForecast.list.forEach(item => { 
                const date = new Date(item.dt * 1000);
                const dia = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }); 
                const hora = date.getHours();
                if (hora === 12 && !days[dia]) { 
                    days[dia] = item;
                } 
            });

        Object.entries(days).slice(0, 5).forEach(([dia, item]) => { 
            const div = document.createElement("div");
            const rainProb = Math.round(item.pop * 100); 
            div.classList.add("info"); 
            div.innerHTML = ` 
            <h5>${dia}</h5> 
            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="clima"> 
            <h5>${Math.round(item.main.temp)} °C</h5>
            <h5>${rainProb} %</h5> `
            ;
            dayContainer.appendChild(div);
        });

        errorMsg.classList.remove("show")
        errorMsg.classList.add("hide")
        weather.classList.remove("hide")
        weather.classList.add("show")
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
