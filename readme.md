# NEXUSWeather Dashboard

NEXUSWeather is a fully responsive weather dashboard that provides current weather information and a 5-day forecast using the OpenWeather API. It includes two chatbot options: one powered by Dialogflow for general weather queries, and another using Google's Gemini API for more advanced interactions.

## Live Demo

You can access the live versions of NEXUSWeather at:
- Firebase: [https://nexus-weather-511.web.app](https://nexus-weather-511.web.app)
- GitHub Pages: [https://ninjaa-aa.github.io/weather-app/](https://ninjaa-aa.github.io/weather-app/)

## Features

- Current weather information
- 5-day weather forecast
- Interactive charts using Chart.js
- Customizable filters for weather data
- Unit conversion (Celsius/Fahrenheit)
- Dual chatbot integration:
  - Dialogflow for general weather queries
  - Gemini API for advanced interactions
- Responsive design
- Geolocation support
- Advanced filtering options

### Filtering Options

- Show temperatures in ascending order
- Show temperatures in descending order
- Filter out days without rain
- Show the day with the highest temperature

### Geolocation Support

The dashboard uses the browser's geolocation API to detect the user's location and show weather information for that location by default.

## Technologies Used

- HTML5
- CSS3 (with Tailwind CSS)
- JavaScript (jQuery)
- OpenWeather API
- Dialogflow API
- Google Gemini API
- Chart.js
- Firebase (for deployment)
- GitHub Pages (for deployment)

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

3. Google Gemini API:
   - Set up a project in the [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key for the Gemini API
   - Replace `'YOUR_GEMINI_API_KEY'` in the chatbot script with your actual API key:
     ```javascript
     const genAI = new GoogleGenerativeAI('YOUR_GEMINI_API_KEY');
     ```

## Deployment

### Firebase Deployment

The project is deployed to Firebase. To deploy your own version:

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

### GitHub Pages Deployment

The project is also live on GitHub Pages. To update the GitHub Pages deployment:

1. Ensure your changes are committed and pushed to the main branch.
2. GitHub Actions will automatically deploy the updated site to GitHub Pages.
3. You can view the deployment process in the "Actions" tab of your GitHub repository.

## Additional Notes

- The project uses the free tier of OpenWeather API, which has a limit of 60 calls/minute. Please be mindful of this limitation when testing.
- Two chatbot options are available:
  - Dialogflow chatbot is integrated using the `<df-messenger>` web component. Ensure you have the correct agent ID for it to function properly.
  - Gemini API chatbot is integrated for more advanced interactions. Make sure you have the correct API key set up.
- The project includes various filters for the weather data, accessible through the dropdown menu on the table page.
- Geolocation functionality requires user permission and a secure context (HTTPS) to work properly.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).