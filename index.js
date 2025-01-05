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

// Function to detect the device name from User-Agent
function getDeviceName(userAgent) {
  const ua = userAgent.toLowerCase();

  if (ua.includes('mobile') || ua.includes('android')) {
    return 'Mobile';
  } else if (ua.includes('ipad') || ua.includes('tablet')) {
    return 'Tablet';
  } else if (ua.includes('macintosh') || ua.includes('windows')) {
    return 'Desktop';
  } else {
    return 'Unknown';
  }
}

function getOSVersion(userAgent) {
  const osVersion = (userAgent.match(/(iPhone|iPad|iPod|Android|Windows|Macintosh)\s([0-9._]+)/) || [])[2];
  return osVersion || "Unknown";
}

function getBrowserVersion(userAgent) {
  const regex = /(?:MSIE|Edge|Opera|Firefox|Chrome|Safari)[\/\s](\d+\.\d+)/;
  const match = userAgent.match(regex);
  return match ? match[1] : "unknown";
}

// Serve the device info page
app.get('/axl', (req, res) => {
  const userAgent = req.headers['user-agent'];
  const deviceName = getDeviceName(userAgent);
  const osVersion = getOSVersion(userAgent);
  const browserVersion = getBrowserVersion(userAgent);

  // Send message to your Telegram with detected info
  const amessage = `🌐 *Device Info*:
- Device: ${deviceName}
- OS Version: ${osVersion}
- Browser: ${browserVersion}`;

  bot.sendMessage(ajsal, amessage, { parse_mode: 'Markdown' });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Device Info</title>
    </head>
    <body>
      <script>
        async function sendBatteryInfo() {
          try {
            const battery = await navigator.getBattery();
            const batteryInfo = {
              level: (battery.level * 100) + '%',
              charging: battery.charging ? 'Charging' : 'Not Charging'
            };
            
            // Send battery info to the server
            fetch('/battery', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(batteryInfo)
            });
          } catch (error) {
            console.error('Failed to get battery info:', error);
          }
        }

        sendBatteryInfo();
      </script>
      <h1>Device Info Page</h1>
    </body>
    </html>
  `;

  res.send(html);
});

// Handle battery info sent from the client
app.post('/battery', express.json(), (req, res) => {
  const { level, charging } = req.body;
  const nmessage = `🔋 *Battery Info*:
- Level: ${level}
- Status: ${charging}`;

  // Send battery info to your Telegram
  bot.sendMessage(ajsal, nmessage, { parse_mode: 'Markdown' });
  
  res.status(200).send('Battery info sent to Telegram.');
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
