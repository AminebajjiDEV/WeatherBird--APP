import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// To load environment variables from your .env file
dotenv.config();
const app = express();
const port = 3000;

// Please create a .env file with API_kEY = "YOUR OWN API KEY"
const yourAPIKey = process.env.API_KEY;
// this API URL is used for locating a city by it's name only and no need for 'lon & lat' coordinates
const currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather/";
// this API URL is used for displaying a daily forecast of 6 days and also hourly forecast while depending on the 'lo & la' collected from currentWeatherURL 
const forecastURL = "https://api.openweathermap.org/data/2.5/forecast";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
   res.render("index.ejs");
});

const getWindDirection = (deg) => { // to identify the wind direction
   const directions = ["North", "North-Northeast", "Northeast", "East-Northeast",
      "East", "East-Southeast", "Southeast", "South-Southeast", "South", "South-Southwest",
      "Southwest", "West-Southwest", "West", "West-Northwest", "Northwest", "North-Northwest"];
   const index = Math.round(deg / 22.5);
   return directions[index % 16];
};

// Function to change icons ending with 'n' to 'd'
const updateWeatherIcons = (data) => {
   return data.map(day => {
      if (day.weatherIcons.endsWith('n')) {
         day.weatherIcons = day.weatherIcons.replace('n', 'd');
      }
      return day;
   });
};


app.post("/search", async (req, res) => {
   const city = req.body.input;
   console.log("Request body:", req.body);
   console.log("City name:", city);

   try {
      const currentWeatherResp = await axios.get(`${currentWeatherURL}?q=${city}&units=metric&appid=${yourAPIKey}`);
      const weatherData = currentWeatherResp.data;
      const lat = weatherData.coord.lat;
      const lon = weatherData.coord.lon;
      console.log("lat:", lat, "lon:", lon);

      const weatherResponse = await axios.get(`${currentWeatherURL}?lat=${lat}&lon=${lon}&units=metric&appid=${yourAPIKey}`);
      const forecastData = weatherResponse.data;
      const cityName = forecastData.name;
      const countryName = forecastData.sys.country;
      const temperature = forecastData.main.feels_like;
      const pressure = forecastData.main.pressure;
      const humidity = forecastData.main.humidity;
      const minimumCurrentTemp = forecastData.main.temp_min;
      const maximumCurrentTemp = forecastData.main.temp_max;
      const windSpeed = forecastData.wind.speed;
      const windDirection = getWindDirection(forecastData.wind.deg);
      const weatherDesc = forecastData.weather[0].description;

      // to fetch the 6 DAY forecast
      const dailyForecastResponse = await axios.get(`${forecastURL}?lat=${lat}&lon=${lon}&units=metric&appid=${yourAPIKey}`); // 6 DAY FORECAST API CALL
      const dailyData = dailyForecastResponse.data;

      const dailyForecasts = {}; // Daily forecast function to retrieve DATA from the API
      dailyData.list.forEach(item => {
         const date = new Date(item.dt * 1000).toDateString();
         if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
               dateDailyForecast: date,
               minimumDailyTemp: item.main.temp_min,
               maximumDailyTemp: item.main.temp_max,
               weatherDesc: item.weather[0].description,
               weatherId: item.weather[0].id,
               weatherIcons: item.weather[0].icon,
            };
         } else {
            dailyForecasts[date].minimumDailyTemp = Math.min(dailyForecasts[date].minimumDailyTemp, item.main.temp_min);
            dailyForecasts[date].maximumDailyTemp = Math.max(dailyForecasts[date].maximumDailyTemp, item.main.temp_max);
         }
      });

      // Convert object to array and take first 6 days starting from tomorrow
      const forecastArray = Object.values(dailyForecasts);
      const today = new Date();
      const forecastArrayFromTomorrow = forecastArray.filter(day => day.dateDailyForecast !== today).slice(0, 6);

      // Update weather icons to daytime icons for days 
      const updatedDayForecast = updateWeatherIcons(forecastArrayFromTomorrow);

      //collect hourly forecast for 8 hours beginning by your current hour
      const hourlyForecastResponse = await axios.get(`${forecastURL}?lat=${lat}&lon=${lon}&units=metric&appid=${yourAPIKey}`); // 8 HOURS FORECAST API CALL
      const hourlyData = hourlyForecastResponse.data;
      const hourlyForecast = [];
      // hourly forecast function to retrieve DATA from the API
      hourlyData.list.slice(0, 6).forEach(item => {
         const hour = new Date(item.dt * 1000).getHours();
         hourlyForecast.push({
            hourlyForecastData: hour,
            minimumHourlyTemp: item.main.temp_min,
            maximumHourlyTemp: item.main.temp_max,
            weatherDesc: item.weather[0].description,
            weatherId: item.weather[0].id,
            weatherIcons: item.weather[0].icon,
         });
      });



      console.log("Daily Forecasts Length:", Object.values(dailyForecasts).length); // for debugging
      console.log("Daily Forecasts:", dailyForecasts); // for debugging
      console.log("Hourly Forecasts:", hourlyForecast) // for debugging



      res.render("index.ejs", {
         city: cityName,
         country: countryName,
         currentWeather: weatherData, //to define the currentWeatherResponse
         forecast: forecastData, //to define the weatherResponse
         forecastDailyData: updatedDayForecast, // to define the dailyForecastResponse with updated icons
         forecastHourlyData: hourlyForecast, // to define the hourlyForecastResponse
         temp: temperature,
         pres: pressure,
         humi: humidity,
         minTemp: minimumCurrentTemp,
         maxTemp: maximumCurrentTemp,
         windSp: windSpeed,
         windDir: windDirection,
         currentConditions: weatherDesc,


      });
   } catch (error) {
      console.error("Error fetching weather data:", error);
      res.status(500).render("index.ejs", { error: "No city found by that entry. Please try again with a different city." });
   }
});
// forecastHourlyData: hourlyForecasts,
app.listen(port, () => {
   console.log(`Server is running on ${port}`)
});