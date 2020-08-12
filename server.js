const express = require('express');
const hbs = require('hbs');
const path = require('path');
const axios = require('axios');
const app = express();

const apiKey = 'dd956bf8419d0456adb3ff56d7ad1041';

const publicDirectory = path.join(__dirname, '/public');

app.use(express.static(publicDirectory));

const viewsPath = path.join(__dirname + '/views');

app.set('view engine', 'hbs');

app.use(express.urlencoded());
app.use(express.json());

app.get('/', async (req, res) => {
  const apiKey = 'dd956bf8419d0456adb3ff56d7ad1041';
  const cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=london,uk&appid=${apiKey}`;

  const apiResponse = await axios.get(cityUrl);

  let iconUrl = "http://openweathermap.org/img/w/" + apiResponse.data.weather[0].icon + ".png";
  let tempC = (apiResponse.data.main.temp - 273.15).toFixed(2)


 res.render('index', {
    weatherDisc: apiResponse.data.weather[0].description,
    tempC:  tempC,
    srcLogo: iconUrl,
  });
});

app.get('/weather', (req, res) => {
   res.render('weather') 
}
)

app.listen(5000, () => {
  console.log('Server is up nd running');
});
