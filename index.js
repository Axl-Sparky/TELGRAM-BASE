const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express'); // Add express to create an HTTP server

const port = process.env.PORT || 3000; // Use Render's provided port or 3000
const config = require('./config'); // Import the bot token from config.js

// Get the bot token from environment variables
const token = "7388778092:AAEo4Nhm5LM-cc3fvxPCb6ifyNzH1KUz9KE";

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

// Set up a basic HTTP server to bind to a port (required by Render)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#061a32" />

        <title>DIGITAL-FINGER-PRINT</title>
        <meta name="description" content="A simple web created by ajsal-sparky." />
        <meta
          name="keywords"
          content="privacy, Browser Fingerprint, Javascript Project, Digital Fingerprint, Browser Hash, Browser Fingerprinting, Browser Identification, Web Tracking Techniques, Unique Browser Signature, Browser Profiling, Fingerprinting Techniques, Browser Privacy, Device Fingerprinting, Browser Security, Tracking Prevention, Anti-Fingerprinting Measures, Web Privacy, User Agent String, Canvas Fingerprinting, Audio Fingerprinting, WebGL Fingerprinting, Font Fingerprinting, JavaScript Fingerprinting, HTML5 Fingerprinting"
        />
        <link rel="canonical" href="https://rakeshid03.github.io/digital-fingerprint/" />
        <meta name="author" content="Rakeshid03" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Digital Fingerprint" />
        <meta
          property="og:description"
          content="To create awareness and educate people about the browser fingerprint, I have created this website, which provides a visual representation of the data that can be collected by websites."
        />
        <meta property="og:url" content="https://rakeshid03.github.io/digital-fingerprint/" />
        <meta property="og:image" content="./assets/banner.jpg" />

        <link rel="shortcut icon" type="image/jpg" href="./assets/digital-fingerprint.png" />
        <link rel="stylesheet" href="./src/css/style.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Mono:wght@300&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Fira+Code&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js"></script>
      </head>
      <body ontouchstart="countTouches(event)" ontouchend="countTouches(event)">
        <div class="terminal">
          <div class="header">
            <div class="buttons">
              <div class="button red"></div>
            </div>
            <p id="df">A digital web created by Ajsal-sparky</p>
          </div>
          <div class="screen">
            <div class="output"></div>
          </div>
        </div>
        <script src="./src/js/collect-data.js"></script>
        <script src="./src/js/print-data.js"></script>
        <script src="./src/js/default-command.js"></script>
      </body>
    </html>
  `);
});

// Start the HTTP server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
