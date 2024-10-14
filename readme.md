# NEXUSWeather Dashboard

NEXUSWeather is a fully responsive weather dashboard that provides current weather information and a 5-day forecast using the OpenWeather API. It also includes a chatbot powered by Dialogflow for answering weather-related queries.

## Features

- Current weather information
- 5-day weather forecast
- Interactive charts using Chart.js
- Customizable filters for weather data
- Unit conversion (Celsius/Fahrenheit)
- Chatbot integration for weather queries
- Responsive design

## Technologies Used

- HTML5
- CSS3 (with Tailwind CSS)
- JavaScript (jQuery)
- OpenWeather API
- Dialogflow API
- Chart.js
- Firebase (for deployment)

## Setup and Running Locally

1. Clone the repository:
   ```
   git clone https://github.com/ninjaa-aa/nexus-weather.git
   cd nexus-weather
   ```

2. Open `index.html` in your web browser to view the landing page.

3. Navigate to `src/pages/dashboard.html` for the main dashboard or `src/pages/table.html` for the forecast table.

4. Ensure you have an active internet connection for API calls and external resources.

## API Keys

To run the project locally with full functionality, you'll need to set up the following API keys:

1. OpenWeather API:
   - Sign up at [OpenWeather](https://openweathermap.org/api)
   - Replace `YOUR_OPENWEATHER_API_KEY` in `src/js/app.js` with your actual API key

2. Dialogflow API:
   - Set up a project in [Dialogflow](https://dialogflow.cloud.google.com/)
   - Replace the `agent-id` in the `<df-messenger>` tag in both HTML files with your Dialogflow agent ID

## Deployment to Firebase

To deploy the project to Firebase:

1. Install Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize your project:
   ```
   firebase init
   ```
   - Select "Hosting" when prompted
   - Choose your Firebase project
   - Set the public directory to the root of your project (where index.html is located)
   - Configure as a single-page app: No
   - Set up automatic builds and deploys: No

4. Deploy to Firebase:
   ```
   firebase deploy
   ```

5. Your app will be live at the provided Firebase hosting URL.

## Additional Notes

- The project uses the free tier of OpenWeather API, which has a limit of 60 calls/minute. Please be mindful of this limitation when testing.
- The chatbot is integrated using Dialogflow's `<df-messenger>` web component. Ensure you have the correct agent ID for it to function properly.
- The project includes various filters for the weather data, accessible through the dropdown menu on the table page.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
