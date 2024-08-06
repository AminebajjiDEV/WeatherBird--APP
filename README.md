# WeatherBird Forecast Application

This capstone project for my web development bootcamp involves building a website using the Express/Node.js platform and the Axios HTTP client. The website integrates a chosen public API from the Public API Lists, allowing interaction with the API to retrieve data and present it in a user-friendly manner.

## Objectives
    - Develop an understanding of how to integrate public APIs into web projects.    
    - Gain practical experience using Express/Node.js for server-side programming.    
    - Enhance understanding of client-server communication using Axios.
    - Demonstrate the ability to manipulate, present, and work with data retrieved from APIs.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Scripts](#scripts)
- [License](#license)

## Features

- Fetch current weather data, hourly forecast, and daily forecast from OpenWeather API.
- Display weather information with dynamic icons.
- Live clock display on the homepage.
- Personalized greeting message based on the time of day.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/AminebajjiDEV/WeatherBird--APP.git
   cd weatherbird-APP 
   
2. Install the dependencies:
   ```sh
   npm install

3. Create a .env file in the root directory and add your OpenWeather API key: (This step is crucial as i didn't upload my personal key)
   ```sh
    API_KEY=your_api_key_here

## Usage
   #### Start the Server
    npm start 
    or
    nodemon index.js (if you have nodemon installed)
    Open your browser and navigate to http://localhost:3000.

## Screenshots
- Home page (With results)
  
![App Screenshot](https://github.com/AminebajjiDEV/WeatherBird--APP/blob/main/public/images/Screenshot%202024-08-06%20at%2022-00-11%20WeatherBird.png)

- Home page (Before Results)

![App Screenshot](https://github.com/AminebajjiDEV/WeatherBird--APP/blob/main/public/images/Screenshot%202024-08-07%20at%2000-09-37%20WeatherBird.png)   

- Home page (If there is an Error)
  
![App Screenshot](https://github.com/AminebajjiDEV/WeatherBird--APP/blob/main/public/images/Screenshot%202024-08-07%20at%2000-00-42%20WeatherBird.png)

- Mobile Responsiveness
  
 ![App Screenshot](https://github.com/AminebajjiDEV/WeatherBird--APP/blob/main/public/images/Screenshot%202024-08-06%20at%2022-02-21%20WeatherBird.png) 

### Check the images forlder for more pictures!


## API Endpoints

    POST /search: Fetch weather data for a specific location using the city name.

## Technologies Used

- Backend: Node.js, Express
- HTTP Client: Axios
- Templating: EJS
- Frontend: HTML, CSS, JavaScript

## Scripts

1.Greeting Message:

A JavaScript script that displays a greeting message based on the current time.
```
javascript

const greetingContainer = document.querySelector(".greet"); // to target the div directly

const timeNow = new Date().getHours();
console.log(timeNow) // for debugging

const greeting = 
timeNow >= 5 && timeNow < 12 
? "Good Morning"
: timeNow >= 12 && timeNow < 18
? "Good Afternoon"
: "Good Evening"
console.log(greeting); // for debugging

greetingContainer.innerHTML = `<h1>${greeting}</h1>`  // to display the greeting message in the DOM
```

2.Live Clock:

A JavaScript script that displays a live clock on the webpage.
```
javascript

 const timeElement = document.querySelector(".clock_time");
    const dateElement = document.querySelector(".clock_date");    
    /** 
    * @param {Date} date
    */
    function formatTime(date) {
        const hours12 = date.getHours() % 12 || 12;
        const minutes = date.getMinutes();
        const isAm = date.getHours() < 12;
        return `${hours12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${isAm ? "AM" : "PM"}`;
    }
    function formatDate(date) {
        const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
    }
    setInterval(() => { // to update time using an intervale 
        const now = new Date();
        timeElement.textContent = formatTime(now);
        dateElement.textContent = formatDate(now);
    }, 200);


    setInterval();
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
   
