// Maps weather description keywords to Font Awesome icon classes
function getWeatherIcon(condition) {
    const c = condition.toLowerCase();

    if (c.includes("thunder") || c.includes("storm"))
        return "fa-solid fa-cloud-bolt";
    if (c.includes("snow") || c.includes("blizzard") || c.includes("sleet"))
        return "fa-solid fa-snowflake";
    if (c.includes("rain") || c.includes("drizzle") || c.includes("shower"))
        return "fa-solid fa-cloud-rain";
    if (c.includes("mist") || c.includes("fog") || c.includes("haze"))
        return "fa-solid fa-smog";
    if (c.includes("cloud") || c.includes("overcast"))
        return "fa-solid fa-cloud";
    if (c.includes("sunny") || c.includes("clear"))
        return "fa-solid fa-sun";
    if (c.includes("partly"))
        return "fa-solid fa-cloud-sun";

    return "fa-solid fa-cloud"; // fallback
}

// Updates the weather card with data from the API response
function updateCard(city, data) {
    const condition = data.current_condition[0].weatherDesc[0].value;

    document.getElementById("city").innerText = city;
    document.getElementById("temp").innerText = data.current_condition[0].temp_C + "°C";
    document.getElementById("condition").innerText = condition;
    document.getElementById("humidity").innerText = data.current_condition[0].humidity + "%";
    document.getElementById("wind").innerText = data.current_condition[0].windspeedKmph + " km/h";

    // FIX: dynamically update the weather icon based on the condition
    const iconEl = document.querySelector(".weather-icon i");
    iconEl.className = getWeatherIcon(condition);
}

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    try {
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);

        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        updateCard(city, data);

    } catch (error) {
        alert("City not found. Please check the spelling and try again.");
    }
}

// Allow pressing Enter in the input field to trigger search
document.getElementById("cityInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") getWeather();
});

function getLocationWeather() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
            const response = await fetch(`https://wttr.in/${lat},${lon}?format=j1`);

            if (!response.ok) throw new Error("Unable to fetch location weather");

            const data = await response.json();
            const city = data.nearest_area[0].areaName[0].value;
            updateCard(city, data);

        } catch (error) {
            alert("Unable to fetch weather for your location. Please try again.");
        }

    }, () => {
        // FIX: handle the case where the user denies location permission
        alert("Location access denied. Please allow location access and try again.");
    });
}