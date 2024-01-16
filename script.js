document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch weather data based on user's location
    function fetchWeatherData(latitude, longitude) {
        const elevationUrl = `https://api.open-meteo.com/v1/elevation?latitude=${latitude}&longitude=${longitude}`;

        // Make a request to get elevation data
        fetch(elevationUrl)
            .then(response => response.json())
            .then(elevationData => {
                const weatherUrl = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${latitude}&lon=${longitude}&altitude=${elevationData.elevation}`;

                // Make a request to get weather data
                fetch(weatherUrl, {
                    headers: {
                        'User-Agent': 'Vaermelding aracenafernando@gmail.com',
                    },
                })
                    .then(response => response.json())
                    .then(weatherData => {
                        // Update the HTML with weather information
                        document.getElementById('altitude').innerText = `${elevationData.elevation} Moh`; 
                        document.getElementById('temperature').innerText = `${weatherData.properties.timeseries[0].data.instant.details.air_temperature} C`;
                        document.getElementById('humidity').innerText = `Humidity: ${weatherData.properties.timeseries[0].data.instant.details.relative_humidity} %`;

                        const precipitationAmount = weatherData.properties.timeseries[0].data.next_1_hours.details.precipitation_amount;
                        const probPrecipitation = weatherData.properties.timeseries[0].data.next_1_hours.details.probability_of_precipitation;

                        document.getElementById('precipitation').innerText = `Precipitation: ${precipitationAmount} mm`;
                        document.getElementById('probPrecipitation').innerText = `Probability: ${probPrecipitation} %`;

                        const windFromDirection = weatherData.properties.timeseries[0].data.instant.details.wind_from_direction;
                        const windSpeed = weatherData.properties.timeseries[0].data.instant.details.wind_speed;

                                                // Convert wind speed from m/s to km/h
                                                const windSpeedKmPerHour = Math.round(windSpeed * 3.6);

                        document.getElementById('wind-direction').innerText = `${getWindDirection(windFromDirection)}`;
                        document.getElementById('wind-speed').innerText = `${windSpeedKmPerHour} km/h`;

                        // Hide or show precipitation-related elements based on the value
                        const precipitationElement = document.getElementById('precipitation');
                        const probPrecipitationElement = document.getElementById('probPrecipitation');

                        if (precipitationAmount === 0) {
                            precipitationElement.style.display = 'none';
                            probPrecipitationElement.style.display = 'none';
                        } else {
                            precipitationElement.style.display = 'block';
                            probPrecipitationElement.style.display = 'block';
                        }

                        // Additional functionality for symbols and other data
                        const weatherIcon = document.getElementById('weather-icon');
                        const weatherIcon6 = document.getElementById('weather-icon6');
                        const weatherIcon12 = document.getElementById('weather-icon12');
                        const probPrep6 = document.getElementById('probPrep6');
                        const probPrep12 = document.getElementById('probPrep12');
                        const prepAm6 = document.getElementById('prepAm6');

                        const capitalize = (string) => {
                            return string.charAt(0).toUpperCase() + string.slice(1);
                        };

                        // Set symbol codes and other weather data
                        forecast1.textContent = `${capitalize(weatherData.properties.timeseries[0].data.next_1_hours.summary.symbol_code)}`;
                        forecast6.textContent = `Next 6 Hours: ${capitalize(weatherData.properties.timeseries[0].data.next_6_hours.summary.symbol_code)}`;
                        forecast12.textContent = `Next 12 Hours: ${capitalize(weatherData.properties.timeseries[0].data.next_12_hours.summary.symbol_code)}`;

                        weatherIcon.src = `svg/${weatherData.properties.timeseries[0].data.next_1_hours.summary.symbol_code}.svg`;
                        weatherIcon6.src = `svg/${weatherData.properties.timeseries[0].data.next_6_hours.summary.symbol_code}.svg`;
                        weatherIcon12.src = `svg/${weatherData.properties.timeseries[0].data.next_12_hours.summary.symbol_code}.svg`;

                        probPrep6.textContent = `Prob. Precipitation: ${weatherData.properties.timeseries[0].data.next_6_hours.details.probability_of_precipitation} %`;
                        probPrep12.textContent = `Prob. Precipitation: ${weatherData.properties.timeseries[0].data.next_12_hours.details.probability_of_precipitation} %`;
                        prepAm6.textContent = `Amount: ${weatherData.properties.timeseries[0].data.next_6_hours.details.precipitation_amount} mm`;

                    })
                    .catch(error => {
                        console.error('Error fetching weather data:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching elevation data:', error);
            });
    }

    // Function to get the cardinal direction from degrees
    function getWindDirection(degrees) {
        const directions = ['↓ N', '↙ NE', '← E', '↖ SE', '↑ S', '↗ SW', '→ W', '↘ NW'];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    }

    // Use the Geolocation API to get the user's location
    navigator.geolocation.getCurrentPosition(position => {
        // Extract latitude and longitude from the obtained position
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Call the fetchWeatherData function with obtained location
        fetchWeatherData(latitude, longitude);
    });
});