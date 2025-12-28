document.getElementById('getBtn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    if (!city) return;

    try {
        const response = await fetch(`/api/weather?city=${city}`);
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        document.getElementById('cityDisplay').innerText = `${city.toUpperCase()}, ${data.weather.country}`;
        document.getElementById('temp').innerText = data.weather.temp;
        document.getElementById('weatherDesc').innerText = data.weather.description;
        document.getElementById('feels').innerText = data.weather.feels_like;
        document.getElementById('wind').innerText = data.weather.wind_speed;
        document.getElementById('rain').innerText = data.weather.rain_3h;
        document.getElementById('coords').innerText = `${data.weather.coordinates.lat}, ${data.weather.coordinates.lon}`;

        const newsList = document.getElementById('newsList');
        newsList.innerHTML = data.news.map(n => `
            <div class="news-item">
                <a href="${n.url}" target="_blank"><strong>${n.title}</strong></a>
                <p style="font-size: 0.8em; color: gray;">Source: ${n.source}</p>
            </div>
        `).join('');

        document.getElementById('dashboard').classList.remove('hidden');
    } catch (err) {
        alert(err.message);
    }
});