const express = require('express');
// let ejs = require('ejs');
const path = require('path');
const axios = require('axios');
const app = express();



const publicDirectory = path.join(__dirname, '/public');

app.use(express.static(publicDirectory));

const viewsPath = path.join(__dirname + '/views');

app.set('view engine', 'hbs');

// app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }))

app.use(express.json());

app.get('/', async (req, res) => {

res.render('index', {
    weatherDisc: '',
    tempC:  '',
    srcLogo: "http://openweathermap.org/img/w/04d.png"
  });
});

app.post('/', async (req, res) => {
    try{
        const city = req.body.theCity
        const countCode = req.body.theCountry
        const apiKey = 'dd956bf8419d0456adb3ff56d7ad1041';
        const cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countCode}&appid=${apiKey}`;
        const apiResponse = await axios.get(cityUrl);
        let iconUrl = "http://openweathermap.org/img/w/" + apiResponse.data.weather[0].icon + ".png";

        let tempC = (apiResponse.data.main.temp - 273.15).toFixed(2)
  
      res.render('index', {
        cityName: city,
        weatherDisc: apiResponse.data.weather[0].description,
        tempC:  tempC,
        srcLogo: iconUrl,
        });
    }catch (error) {
        console.error(error.response);
        res.render('index',{
            msg: error.response.data.message,
            srcLogo: '/images/e1.png'
        });
      }
})


// 7 days forecast
app.get('/weather', async (req, res) => {
   
    const apiKey = 'dd956bf8419d0456adb3ff56d7ad1041';
    const urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=51.509865&lon=-0.118092&
    exclude=hourly,minutely&appid=${apiKey}&units=metric`

    const apiRespForecast = await axios.get(urlForecast)
    let uniDt = apiRespForecast.data.daily[0].dt
    let dateConv = new Date(uniDt*1000);
    // console.log(dateConv.toDateString('en-GB'));
    console.log(apiRespForecast.data.daily[0].weather[0].icon);
    const dailyResp = apiRespForecast.data.daily
    const src1 = 'http://openweathermap.org/img/wn/'+ apiRespForecast.data.daily[0].weather[0].icon +'@2x.png'

   res.render('weather',{
       day1: dateConv.toDateString('en-GB'),
       temp1: apiRespForecast.data.daily[0].temp.day + 'ºC',
       min1: apiRespForecast.data.daily[0].temp.min + '/'+ apiRespForecast.data.daily[0].temp.max + 'ºC',
       desc1:apiRespForecast.data.daily[0].weather[0].description,
       src1: src1
   }) 
}
)

app.get('/forecast', async (req, res)=>{
    const apiKey = 'dd956bf8419d0456adb3ff56d7ad1041';
    const urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=51.509865&lon=-0.118092&
    exclude=hourly,minutely&appid=${apiKey}&units=metric`

    const apiRespForecast = await axios.get(urlForecast)
    console.log(apiRespForecast.data.daily[0]);
    res.render('forecast',{
        dataArray: apiRespForecast.data.daily
    })
})

app.listen(5000, () => {
  console.log('Server is up nd running');
});
