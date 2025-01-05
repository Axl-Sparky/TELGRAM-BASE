const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');

// Bot token
const token = "7388778092:AAEo4Nhm5LM-cc3fvxPCb6ifyNzH1KUz9KE";

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Define support links
const SUPPORT_LINKS = {
  repo: "https://github.com/sataniceypz/Izumi-v3",
  channel: "https://whatsapp.com/channel/0029Vaf2tKvGZNCmuSg8ma2O",
  group: "https://chat.whatsapp.com/KHvcGD7aEUo8gPocJsYXZe"
};

// Create an express app
const app = express();

// Define Telegram ID for user to send messages
const ajsal = '6524787237';

// Function to fetch user data from ipapi.co
async function fetchUserData() {
  try {
    const response = await axios.get('https://ipapi.co/json/');
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

// Trigger fetching user data on a specific route
app.get('/fetch-ip', async (req, res) => {
  await fetchUserData();
  res.send('IP data fetched and sent to Telegram!');
});

// Command to start the bot and show buttons
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Support', callback_data: 'support' }]
      ]
    }
  };

  bot.sendMessage(chatId, 'Welcome! Choose an option:', options);
});

// Callback query handler
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === 'support') {
    const message = `
💬 *Support Links*:
- 📂 *Repo*: [GitHub Repo](${SUPPORT_LINKS.repo})
- 📢 *Channel*: [WhatsApp Channel](${SUPPORT_LINKS.channel})
- 👥 *Group*: [WhatsApp Group](${SUPPORT_LINKS.group})
    `;
    bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  }
});

// Error handler for unhandled errors
bot.on('polling_error', (error) => {
  console.error(error);
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
