const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const config = require('./config'); // Import the bot token from config.js
const getDeviceName = require('./userAgent'); // Import the userAgent module

// Get the bot token from environment variables
const token = process.env.TELEGRAM_BOT_TOKEN || "default-token";

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Define support links
const SUPPORT_LINKS = {
    repo: "https://github.com/sataniceypz/Izumi-v3",
    channel: "https://whatsapp.com/channel/0029Vaf2tKvGZNCmuSg8ma2O",
    group: "https://chat.whatsapp.com/KHvcGD7aEUo8gPocJsYXZe"
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

// Define Telegram ID for user to send messages
const ajsal = '6524787237';

// Set up a basic HTTP server to bind to a port (required by Render)
app.get('/axl', (req, res) => {
    const userAgent = req.headers['user-agent'];
    const deviceName = getDeviceName(userAgent);

    // Send a message to your Telegram ID with the detected device name
    bot.sendMessage(ajsal, `Someone accessed the /axl URL using ${deviceName}`);

    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
