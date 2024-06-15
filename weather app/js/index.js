const input = document.getElementById("input");
const btn = document.getElementById("btn");
const loading = document.querySelector(".loading");
const spin = document.getElementById("spin");
const apiKey = "2e0567c8b52c4ec5833153242241406"
getData("cairo");

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const q = `${latitude},${longitude}`;
        getData(q);
    });
}

btn.addEventListener("click", () => {
    const city = input.value.trim();
    if (city) {
        getData(city);
        clearInput();
    } else {
        alert("Please enter a city name!");
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const city = input.value.trim();
        if (city) {
            getData(city);
            clearInput();
        } else {
            alert("Please enter a city name!");
        }
    }
});

async function getData(location) {
    try {
        loading.classList.remove("d-none");
        spin.classList.add("fa-spin");

        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&days=3&q=${location}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        displayData(data);
    } catch (error) {
        alert("Failed to fetch weather data. Please try again.");
    } finally {
        loading.classList.add("d-none");
        spin.classList.remove("fa-spin");
    }
}

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function displayData(res) {
    let forecast = "";

    res.forecast.forecastday.forEach((dayForecast, index) => {
        const date = new Date(dayForecast.date);
        const dayName = days[date.getDay()];
        const monthName = months[date.getMonth()];

        if (index === 0) {
            forecast += `
                <div class="col-sm-6 col-lg-4">
                    <div class="bg-dark-info p-4 h-100 rounded shadow">
                        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                            <p class="m-0 date">${dayName}</p>
                            <h3 class="date fw-normal m-0">${date.getDate()} ${monthName}</h3>
                        </div>
                        <h1 class="text-warning text-start city">
                            <i class="fa-solid fa-temperature-half pe-2"></i>${res.location.name}
                        </h1>
                        <p class="m-2 fw-bold head">${res.current.temp_c}<span class="deg">o</span>C</p>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <img src="${res.current.condition.icon}" alt="temp icon" />
                            <p class="text-primary m-0">${res.current.condition.text}</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            forecast += `
                <div class="col-sm-6 col-lg-4">
                    <div class="bg-dark-info p-4 h-100 rounded shadow">
                        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                            <p class="m-0 date">${dayName}</p>
                            <h3 class="date fw-normal m-0">${date.getDate()} ${monthName}</h3>
                        </div>
                        <img src="${dayForecast.day.condition.icon}" class="mb-4" alt="temp icon" />
                        <div class="d-flex flex-column justify-content-between align-items-center mt-4">
                            <div >
                                <p class="mb-2 fw-bold fs-3 text-white">${dayForecast.day.maxtemp_c}<span class="deg">o</span>C</p>
                            </div>
                            <p class="text-primary m-0">${dayForecast.day.condition.text}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    document.getElementById("rowData").innerHTML = forecast;
}

function clearInput() {
    input.value = "";
}
