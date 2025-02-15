const API_KEY = 'AIzaSyDzWChu9spFD-1e4vxkdXPEJAbtLqa2Jv0';  // Replace with your actual API key

async function checkPhishing(url) {
  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;
  const requestBody = {
    client: {
      clientId: "phishing-detector",
      clientVersion: "1.0"
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
      platformTypes: ["WINDOWS"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url: url }]
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const result = await response.json();

  // If the result has matches, the website is dangerous
  if (result.matches) {
    return true; // Phishing or Malware detected
  } else {
    return false; // Safe
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkUrl") {
    checkPhishing(request.url).then(isPhishing => {
      sendResponse({ isPhishing: isPhishing });
    });
    return true; // To indicate the response is asynchronous
  }
});
