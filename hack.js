// userAgent.js
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

module.exports = getDeviceName;
