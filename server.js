const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
        const weatherResponse = await axios.get(weatherUrl);
        const w = weatherResponse.data;

        const newsUrl = `https://newsapi.org/v2/everything?q=${city}&pageSize=3&apiKey=${process.env.NEWS_API_KEY}`;
        const newsResponse = await axios.get(newsUrl).catch(() => ({ data: { articles: [] } }));

        const finalData = {
            weather: {
                temp: w.main.temp,
                description: w.weather[0].description,
                coordinates: {
                    lat: w.coord.lat,
                    lon: w.coord.lon
                },
                feels_like: w.main.feels_like,
                wind_speed: w.wind.speed,
                country: w.sys.country,
                rain_3h: w.rain ? (w.rain['3h'] || 0) : 0
            },
            news: newsResponse.data.articles.map(article => ({
                title: article.title,
                url: article.url,
                source: article.source.name
            }))
        };

        res.json(finalData);

    } catch (error) {
        res.status(500).json({ error: 'City not found or server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});