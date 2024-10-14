$(document).ready(function() {
    const API_KEY = '270dba6bb177472c46701328f9dd42f5';
    const BASE_URL = 'https://api.openweathermap.org/data/2.5';
    let currentUnit = 'metric';
    let tempChart, precipChart, aqiChart;
    let weatherData = {};
    let lastSearchTerm = '';
    let forecastData = [];
    
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

    $('#unitToggle').on('change', function() {
        currentUnit = this.checked ? 'imperial' : 'metric';
        updateTemperatures();
        if (forecastData.length > 0) {
            updateForecastDisplay();
            if ($('#temperatureChart').length) {
                updateCharts(forecastData, currentUnit);
            }
        }
    });

    function fetchWeatherData(city, unit) {
        showLoadingSpinner();
        $.ajax({
            url: `${BASE_URL}/weather?q=${city}&units=${unit}&appid=${API_KEY}`,
            method: 'GET',
            success: function(data) {
                weatherData[city] = data;
                lastSearchTerm = city;
                updateWeather(data, unit);
                fetchForecast(city, unit);
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
                forecastData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
                $('#city-name').text(data.city.name);
                lastSearchTerm = city;
                updateForecastDisplay();
                if ($('#temperatureChart').length) {
                    updateCharts(forecastData, unit);
                }
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
        const errorElement = $('#error-message');
        errorElement.text(message).slideDown(300).addClass('slide-in');
    }

    function hideErrorMessage() {
        const errorElement = $('#error-message');
        errorElement.slideUp(300).removeClass('slide-in');
    }

    function updateWeather(data, unit) {
        hideErrorMessage(); // Hide error message when updating weather
        $('.text-2xl.font-semibold.mb-4.text-neon-blue').text(data.name).addClass('fade-in');
        updateTemperatures();
        $('.glassmorphism, .weather-icon').addClass('fade-in');
        setTimeout(() => {
            $('.glassmorphism, .weather-icon, .text-2xl.font-semibold.mb-4.text-neon-blue').removeClass('fade-in');
        }, 500);
    }

    function updateTemperatures() {
        const latestData = weatherData[lastSearchTerm];
        if (latestData) {
            const temp = currentUnit === 'metric' ? latestData.main.temp : celsiusToFahrenheit(latestData.main.temp);
            const windSpeed = currentUnit === 'metric' ? latestData.wind.speed : mpsToMph(latestData.wind.speed);
            $('.text-3xl.font-bold.text-white.animate-pulse-slow').each(function(index) {
                $(this).addClass('fade-in');
                if (index === 0) {
                    $(this).text(`${Math.round(temp)}°${currentUnit === 'metric' ? 'C' : 'F'}`);
                } else if (index === 1) {
                    $(this).text(`${latestData.main.humidity}%`);
                } else if (index === 2) {
                    $(this).text(`${windSpeed.toFixed(2)} ${currentUnit === 'metric' ? 'm/s' : 'mph'}`);
                }
                setTimeout(() => $(this).removeClass('fade-in'), 500);
            });
        }
    }

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
                    fetchWeatherData('Tokyo', currentUnit);
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
            fetchWeatherData('Tokyo', currentUnit);
        }
    }

    function fetchWeatherByCoords(lat, lon, unit) {
        showLoadingSpinner();
        $.ajax({
            url: `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`,
            method: 'GET',
            success: function(data) {
                weatherData[data.name] = data;
                lastSearchTerm = data.name;
                updateWeather(data, unit);
                fetchForecastByCoords(lat, lon, unit);
            },
            error: function(xhr) {
                handleApiError(xhr, "your location");
                hideLoadingSpinner();
            }
        });
    }

    function fetchForecastByCoords(lat, lon, unit) {
        $.ajax({
            url: `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`,
            method: 'GET',
            success: function(data) {
                forecastData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
                $('#city-name').text(data.city.name);
                updateForecastDisplay();
                if ($('#temperatureChart').length) {
                    updateCharts(forecastData, unit);
                }
                hideLoadingSpinner();
            },
            error: function(xhr) {
                handleApiError(xhr, "your location");
                hideLoadingSpinner();
            }
        });
    }

    function updateCharts(data, unit) {
        const temperatures = data.map(day => day.main.temp);
        const precipProbabilities = data.map(day => day.pop * 100);
        const humidity = data.map(day => day.main.humidity);

        updateTemperatureChart(temperatures, unit);
        updatePrecipitationChart(precipProbabilities);
        updateAQIChart(humidity);
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

    function updateForecastDisplay() {
        let displayData = [...forecastData];
        const filter = $('#filter-select').val();

        switch(filter) {
            case 'temp-asc':
                displayData.sort((a, b) => a.main.temp - b.main.temp);
                break;
            case 'temp-desc':
                displayData.sort((a, b) => b.main.temp - a.main.temp);
                break;
            case 'highest-temp':
                displayData = [displayData.reduce((max, current) => max.main.temp > current.main.temp ? max : current)];
                break;
            case 'rainy':
                displayData = displayData.filter(day => 
                    day.weather[0].main.toLowerCase().includes('rain') ||
                    day.weather[0].main.toLowerCase().includes('drizzle')
                );
                break;
        }

        const tableBody = $('#forecastTableBody');
        tableBody.empty();

        displayData.forEach((day, index) => {
            const date = new Date(day.dt * 1000);
            const temp = currentUnit === 'metric' ? day.main.temp : celsiusToFahrenheit(day.main.temp);
            const windSpeed = currentUnit === 'metric' ? day.wind.speed : mpsToMph(day.wind.speed);
            const row = `
                <tr class="fade-in" style="animation-delay: ${index * 0.1}s;">
                    <td>${date.toLocaleDateString()}</td>
                    <td>${Math.round(temp)}°${currentUnit === 'metric' ? 'C' : 'F'}</td>
                    <td>
                        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}" class="inline-block mr-2">
                        ${day.weather[0].description}
                    </td>
                    <td>${day.main.humidity}%</td>
                    <td>${windSpeed.toFixed(1)} ${currentUnit === 'metric' ? 'm/s' : 'mph'}</td>
                </tr>
            `;
            tableBody.append(row);
        });
    }

    $('#filter-select').on('change', function() {
        updateForecastDisplay();
        if ($('#temperatureChart').length) {
            updateCharts(forecastData, currentUnit);
        }
    });

    function celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    function mpsToMph(mps) {
        return mps * 2.237;
    }

    function showLoadingSpinner() {
        $('#loading-overlay').removeClass('hidden').addClass('flex');
        $('body').addClass('overflow-hidden'); // Prevent scrolling while loading
    }
    
    function hideLoadingSpinner() {
        $('#loading-overlay').addClass('hidden').removeClass('flex');
        $('body').removeClass('overflow-hidden'); // Allow scrolling again
    }

    function initializeWeather() {
        showLoadingSpinner();
        weatherData = {};
        getLocationAndFetchWeather();
    }

    // Open modal when profile image is clicked
    $('#profile-image').on('click', function() {
        $('#profileModal').removeClass('hidden');
    });

    // Close modal when close button is clicked
    $('#closeModal').on('click', function() {
        $('#profileModal').addClass('hidden');
    });

    // Optionally close modal when clicking outside the modal content
    $('#profileModal').on('click', function(event) {
        if ($(event.target).is('#profileModal')) {
            $('#profileModal').addClass('hidden');
        }
    });

    initializeWeather();

    $('#filter-select').val('all');
});