const express = require('express');
const path = require('path');

// Import TelegramBot
const TelegramBot = require('node-telegram-bot-api');
 // Import the bot token from config.js

const port = process.env.PORT || 3000; // Use Render's provided port or 3000

// Bot token from config
const token = "7388778092:AAEo4Nhm5LM-cc3fvxPCb6ifyNzH1KUz9KE";
const bot = new TelegramBot(token, { polling: true });

// Create an express app
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'src')));

// Notify route for incoming requests
app.post('/notify', async (req, res) => {
  const chatId = "6524787237"; // Replace with your Telegram chat ID
  const message = "Someone accessed your Koyeb URL!";

  try {
    await bot.sendMessage(chatId, message);
    res.status(200).send('Notification sent');
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send('Failed to send notification');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
