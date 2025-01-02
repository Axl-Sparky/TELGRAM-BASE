const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express'); // Add express to create an HTTP server

const port = process.env.PORT || 3000; // Use Render's provided port or 3000
const config = require('./config'); // Import the bot token from config.js

// Get the bot token from environment variables
const token = config.BOT_TOKEN;

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Define support links
const SUPPORT_LINKS = {
  repo: "https://github.com/sataniceypz/Izumi-v3", // Replace with your GitHub repo link
  channel: "https://whatsapp.com/channel/0029Vaf2tKvGZNCmuSg8ma2O", // Replace with your WhatsApp channel link
  group: "https://chat.whatsapp.com/KHvcGD7aEUo8gPocJsYXZe" // Replace with your WhatsApp group link
};

// Create an express app to bind to the port
const app = express();

// Command to start the bot and show buttons
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Support', callback_data: 'support' }],
        [{ text: 'Pair-Code', callback_data: 'pair-code' }]
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
  } else if (data === 'pair-code') {
    bot.sendMessage(chatId, 'Please send your phone number with the country code (e.g., 917902624272).');

    bot.once('message', async (message) => {
      const phoneNumber = message.text;

      // Validate phone number
      if (!phoneNumber || !/^\d{10,15}$/.test(phoneNumber)) {
        bot.sendMessage(chatId, 'Invalid phone number. Please try again with the correct format (e.g., 917902624272).');
        return;
      }

      try {
        const response = await axios.get(`https://izumi.maskser.me/code?number=${phoneNumber}`);
        const code = response.data.code;

        if (code) {
          bot.sendMessage(chatId, `Your verification code is: \n\n\`${code}\`\n\nPlease copy this code.`, { parse_mode: "Markdown" });
        } else {
          bot.sendMessage(chatId, 'Error generating the code. Please try again.');
        }
      } catch (error) {
        bot.sendMessage(chatId, 'Error while generating the code. Please try again later.');
      }
    });
  }
});

// Error handler for unhandled errors
bot.on('polling_error', (error) => {
  console.error(error);
});

// Set up a basic HTTP server to bind to a port (required by Render)
app.get('/', (req, res) => {
  res.send('Telegram bot is running...');
});

// Start the HTTP server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
