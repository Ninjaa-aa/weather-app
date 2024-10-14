$(document).ready(function() {
    const API_KEY = '270dba6bb177472c46701328f9dd42f5';
    const BASE_URL = 'https://api.openweathermap.org/data/2.5';
    let currentUnit = 'metric';
    let tempChart, precipChart, aqiChart;
    let weatherData = {}; // Store weather data for easy conversion
    let lastSearchTerm = ''; // Store the last searched term

    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            }
        }
    };

    // City search functionality
    $('#city-search').on('keyup', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = $(this).val().trim();
            if (searchTerm !== lastSearchTerm) {
                fetchWeatherData(searchTerm, currentUnit);
            }
        }
    });

    $('#search-button').on('click', function() {
        const searchTerm = $('#city-search').val().trim();
        if (searchTerm !== lastSearchTerm) {
            fetchWeatherData(searchTerm, currentUnit);
        }
    });

    // Unit toggle functionality
    $('#unitToggle').on('change', function() {
        currentUnit = this.checked ? 'imperial' : 'metric';
        updateTableTemperatures();
        updateDashboardTemperatures();
        updateCharts(weatherData[lastSearchTerm], currentUnit);
    });

    function fetchWeatherData(city, unit) {
        showLoadingSpinner();
        $.ajax({
            url: `${BASE_URL}/weather?q=${city}&units=${unit}&appid=${API_KEY}`,
            method: 'GET',
            success: function(data) {
                console.log('API response:', data);  // Add this line
                weatherData[city] = data;
                lastSearchTerm = city;
                updateWeather(data, unit);
                fetchForecast(city, unit);
                addWeatherToTable(data, unit);
                hideLoadingSpinner();
            },
            error: function(xhr) {
                handleApiError(xhr, city);
                hideLoadingSpinner();
            }
        });
    }

    function fetchForecast(city, unit) {
        showLoadingSpinner();   
        $.ajax({
            url: `${BASE_URL}/forecast?q=${city}&units=${unit}&appid=${API_KEY}`,
            method: 'GET',
            success: function(data) {
                updateForecast(data, unit);
                updateCharts(data, unit);
                hideLoadingSpinner();
            },
            error: function(xhr) {
                handleApiError(xhr, city);
                hideLoadingSpinner();
            }
        });
    }

    function handleApiError(xhr, city) {
        let errorMessage = '';
        if (xhr.status === 404) {
            errorMessage = `City "${city}" not found. Please check the spelling and try again.`;
        } else if (xhr.status === 429) {
            errorMessage = 'API request limit reached. Please try again later.';
        } else {
            errorMessage = 'An error occurred while fetching weather data. Please try again.';
        }
        showErrorMessage(errorMessage);
    }

    function showErrorMessage(message) {
        // Create or update an error message element
        let errorElement = $('#error-message');
        if (errorElement.length === 0) {
            errorElement = $('<div id="error-message" class="text-red-500 mb-4"></div>');
            $('.glassmorphism').prepend(errorElement);
        }
        errorElement.text(message).show();
        setTimeout(() => errorElement.fadeOut(), 5000); // Hide after 5 seconds
    }

    function updateWeather(data, unit) {
        // Clear any existing error messages
        $('#error-message').hide();

        // Update city name
        $('.text-2xl.font-semibold.mb-4.text-neon-blue').text(data.name);

        // Update current weather
        updateDashboardTemperatures();

         // Add fade-in class to elements
        $('.glassmorphism').addClass('fade-in');
        $('.weather-icon').addClass('fade-in');

        // Remove fade-in class after animation completes
        setTimeout(() => {
            $('.glassmorphism, .weather-icon').removeClass('fade-in');
        }, 500);
    }

    function updateDashboardTemperatures() {
        const latestData = weatherData[lastSearchTerm];
        if (latestData) {
            const temp = currentUnit === 'metric' ? latestData.main.temp : celsiusToFahrenheit(latestData.main.temp);
            const windSpeed = currentUnit === 'metric' ? latestData.wind.speed : mpsToMph(latestData.wind.speed);
            console.log('Updating wind speed:', latestData.wind.speed, 'Converted:', windSpeed);  // Add this line
            $('.text-3xl.font-bold.text-white.animate-pulse-slow').eq(0).text(`${Math.round(temp)}°${currentUnit === 'metric' ? 'C' : 'F'}`);
            $('.text-3xl.font-bold.text-white.animate-pulse-slow').eq(1).text(`${latestData.main.humidity}%`);
            $('.text-3xl.font-bold.text-white.animate-pulse-slow').eq(2).text(`${windSpeed.toFixed(2)} ${currentUnit === 'metric' ? 'm/s' : 'mph'}`);
        }
    }

    function updateForecast(data, unit) {
        console.log('Updating forecast with data:', data);
        const forecastDays = $('.grid.grid-cols-2.sm\\:grid-cols-3.lg\\:grid-cols-5.gap-4 > div');
        const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
        console.log('Filtered daily data:', dailyData);
    
        dailyData.forEach((day, index) => {
            if (index < 5) {
                console.log(`Updating forecast for day ${index + 1}:`, day);
                const dayElement = forecastDays.eq(index);
                const date = new Date(day.dt * 1000);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
                dayElement.find('p:first').text(dayName);
                dayElement.find('.text-lg.font-bold.text-white').text(`${Math.round(day.main.temp)}°${unit === 'metric' ? 'C' : 'F'}`);
                dayElement.find('.text-xs.text-neon-blue').text(day.weather[0].description);
    
                // Update weather icon
                const iconCode = day.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
                console.log(`Loading icon for day ${index + 1}:`, iconUrl);
                
                const imgElement = dayElement.find('img');
                const fallbackIcon = dayElement.find('span');
                
                imgElement.attr('src', iconUrl)
                          .attr('alt', day.weather[0].description)
                          .on('load', function() {
                              console.log(`Icon loaded successfully for day ${index + 1}`);
                              $(this).css('display', 'inline');
                              fallbackIcon.hide();
                          })
                          .on('error', function() {
                              console.error(`Failed to load weather icon for day ${index + 1}:`, iconUrl);
                              $(this).hide();
                              fallbackIcon.show();
                          });
            }
        });
    }

    function displayForecast(forecast, unit) {
        const forecastDays = $('.grid.grid-cols-2.sm\\:grid-cols-3.lg\\:grid-cols-5.gap-4 > div');
        
        forecast.forEach((day, index) => {
            if (index < 5) {
                const dayElement = forecastDays.eq(index);
                const date = new Date(day.dt * 1000);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                dayElement.find('p:first').text(dayName);
                dayElement.find('.text-lg.font-bold.text-white').text(`${Math.round(day.main.temp)}°${unit === 'metric' ? 'C' : 'F'}`);
                dayElement.find('.text-xs.text-neon-blue').text(day.weather[0].main);

                // Update weather icon
                const iconClass = getWeatherIconClass(day.weather[0].main);
                dayElement.find('i').attr('class', `${iconClass} text-2xl my-2 animate-spin-slow`);
            }
        });
    }

    // Geolocation support
    function getLocationAndFetchWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    fetchWeatherByCoords(lat, lon, currentUnit);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    fetchWeatherData('Tokyo', currentUnit); // Fallback to Tokyo if geolocation fails
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
            fetchWeatherData('Tokyo', currentUnit); // Fallback to Tokyo if geolocation is not supported
        }
    }

    function fetchWeatherByCoords(lat, lon, unit) {
        $.ajax({
            url: `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`,
            method: 'GET',
            success: function(data) {
                console.log('API response:', data);
                weatherData[data.name] = data;
                lastSearchTerm = data.name;
                updateWeather(data, unit);
                fetchForecast(data.name, unit);
                addWeatherToTable(data, unit);
            },
            error: function(xhr) {
                handleApiError(xhr, "your location");
            }
        });
    }

    function updateCharts(data, unit) {
        const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
        
        const temperatures = dailyData.map(day => day.main.temp);
        const precipProbabilities = dailyData.map(day => day.pop * 100);
        const humidity = dailyData.map(day => day.main.humidity);

        updateTemperatureChart(temperatures, unit);
        updatePrecipitationChart(precipProbabilities);
        updateAQIChart(humidity); // Using humidity as a proxy for AQI
    }

    function updateTemperatureChart(temperatures, unit) {
        const ctx = document.getElementById('temperatureChart').getContext('2d');
        if (tempChart) tempChart.destroy();
        
        tempChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
                datasets: [{
                    label: `Temperature (°${unit === 'metric' ? 'C' : 'F'})`,
                    data: temperatures,
                    backgroundColor: 'rgba(0, 243, 255, 0.6)',
                    borderColor: 'rgba(0, 243, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                ...commonChartOptions,
                scales: {
                    ...commonChartOptions.scales,
                    y: {
                        ...commonChartOptions.scales.y,
                        beginAtZero: false
                    }
                }
            }
        });
    }

    function updatePrecipitationChart(precipData) {
        const ctx = document.getElementById('precipitationChart').getContext('2d');
        if (precipChart) precipChart.destroy();

        precipChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Rain Probability', 'No Rain Probability'],
                datasets: [{
                    data: [Math.max(...precipData), 100 - Math.max(...precipData)],
                    backgroundColor: [
                        'rgba(0, 143, 255, 0.6)',
                        'rgba(0, 255, 0, 0.6)'
                    ],
                    borderColor: [
                        'rgba(0, 143, 255, 1)',
                        'rgba(0, 255, 0, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                ...commonChartOptions,
                plugins: {
                    ...commonChartOptions.plugins,
                    legend: {
                        ...commonChartOptions.plugins.legend,
                        position: 'bottom'
                    }
                }
            }
        });
    }

    function updateAQIChart(humidityData) {
        const ctx = document.getElementById('airQualityChart').getContext('2d');
        if (aqiChart) aqiChart.destroy();

        aqiChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
                datasets: [{
                    label: 'Humidity (%)',
                    data: humidityData,
                    borderColor: 'rgba(255, 0, 255, 1)',
                    backgroundColor: 'rgba(255, 0, 255, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                ...commonChartOptions,
                scales: {
                    ...commonChartOptions.scales,
                    y: {
                        ...commonChartOptions.scales.y,
                        beginAtZero: true
                    }
                }
            }
        });
    }
    

    function getWeatherIconClass(weatherMain) {
        const iconMap = {
            'Clear': 'fas fa-sun text-yellow-400',
            'Clouds': 'fas fa-cloud text-gray-400',
            'Rain': 'fas fa-cloud-showers-heavy text-blue-400',
            'Snow': 'fas fa-snowflake text-white',
            'Thunderstorm': 'fas fa-bolt text-yellow-500',
            'Drizzle': 'fas fa-cloud-rain text-blue-300',
            'Mist': 'fas fa-smog text-gray-300'
        };
        return iconMap[weatherMain] || 'fas fa-question text-gray-500';
    }

    function addWeatherToTable(data, unit) {
        const tableBody = $('#weatherTableBody');
        const temp = currentUnit === 'metric' ? data.main.temp : celsiusToFahrenheit(data.main.temp);
        const windSpeed = currentUnit === 'metric' ? data.wind.speed : mpsToMph(data.wind.speed);
        const row = `
            <tr>
                <td>${data.name}</td>
                <td>${Math.round(temp)}°${currentUnit === 'metric' ? 'C' : 'F'}</td>
                <td>${data.main.humidity}%</td>
                <td>${windSpeed.toFixed(2)} ${unit === 'metric' ? 'm/s' : 'mph'}</td>
            </tr>
        `;
        
        // Check if the city already exists in the table
        const existingRow = tableBody.find(`tr:contains(${data.name})`);
        if (existingRow.length) {
            existingRow.replaceWith(row);
        } else {
            tableBody.append(row);
        }
    }

    function updateTableTemperatures() {
        hideLoadingSpinner();
        const tableBody = $('#weatherTableBody');
        tableBody.empty();
        Object.values(weatherData).forEach(data => addWeatherToTable(data, currentUnit));
    }
    
    function initializeWeather() {
        showLoadingSpinner();
        $('#weatherTableBody').empty();
        weatherData = {}; // Clear existing data
        const initialCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];
        let citiesLoaded = 0;
        
        initialCities.forEach(city => {
            fetchWeatherData(city, currentUnit, function() {
                citiesLoaded++;
                if (citiesLoaded === initialCities.length) {
                    hideLoadingSpinner();
                }
            });
        });
    }

    function showAllCities() {
        updateFilteredWeatherTable(Object.entries(weatherData));
    }

    function updateFilteredWeatherTable(filteredData) {
        hideLoadingSpinner();
        const tableBody = $('#weatherTableBody');
        tableBody.empty();
        filteredData.forEach(([city, data]) => addWeatherToTable(data, currentUnit));
    }

    function sortTemperaturesAscending() {
        const sortedData = Object.entries(weatherData).sort((a, b) => a[1].main.temp - b[1].main.temp);
        updateFilteredWeatherTable(sortedData);
    }
    
    function sortTemperaturesDescending() {
        const sortedData = Object.entries(weatherData).sort((a, b) => b[1].main.temp - a[1].main.temp);
        updateFilteredWeatherTable(sortedData);
    }
    
    function showHighestTemperature() {
        const highestTempData = Object.entries(weatherData).reduce((max, current) => 
            current[1].main.temp > max[1].main.temp ? current : max
        );
        updateFilteredWeatherTable([highestTempData]);
    }

    function filterRainyDays() {
        const rainyData = Object.entries(weatherData).filter(([city, data]) => 
            data.weather[0].main === 'Rain' || data.weather[0].main === 'Drizzle'
        );
        updateFilteredWeatherTable(rainyData);
    }


    // Add event listener for filter selection
    $('#filter-select').on('change', function() {
        const selectedFilter = $(this).val();
        switch(selectedFilter) {
            case 'temp-asc':
                sortTemperaturesAscending();
                break;
            case 'temp-desc':
                sortTemperaturesDescending();
                break;
            case 'rainy':
                filterRainyDays();
                break;
            case 'highest-temp':
                showHighestTemperature();
                break;
            case 'all':
            default:
                hideLoadingSpinner();
                showAllCities();
        }
    });

    function celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    function mpsToMph(mps) {
        return mps * 2.237;
    }

    function showLoadingSpinner() {
        $('#loading-spinner').removeClass('hidden');
    }
    
    function hideLoadingSpinner() {
        $('#loading-spinner').addClass('hidden');
    }

    initializeWeather();
    getLocationAndFetchWeather();
    $('#filter-select').val('all');
});