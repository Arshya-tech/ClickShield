document.addEventListener("DOMContentLoaded", function () {
    let statusText = document.getElementById("status");
    let loader = document.querySelector(".loader");
    let checkButton = document.getElementById("checkButton");

    const API_KEY = "AIzaSyDzWChu9spFD-1e4vxkdXPEJAbtLqa2Jv0";  // Replace with your actual API key
    const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

    function getActiveTabUrl(callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                callback(tabs[0].url);
            }
        });
    }

    function checkWebsiteSafety() {
        loader.style.display = "inline-block";
        statusText.innerText = "Analyzing...";

        getActiveTabUrl((currentUrl) => {
            let requestData = {
                client: {
                    clientId: "phishing-detector",
                    clientVersion: "1.0"
                },
                threatInfo: {
                    threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
                    platformTypes: ["ANY_PLATFORM"],
                    threatEntryTypes: ["URL"],
                    threatEntries: [{ url: currentUrl }]
                }
            };

            fetch(API_URL, {
                method: "POST",
                body: JSON.stringify(requestData),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(data => {
                    setTimeout(() => {
                        loader.style.display = "none";
    
                        if (data.matches) {
                            statusText.innerHTML = "⚠️ This might be a phishing site!";
                            statusText.style.color = "#ff1744";
                        } else {
                            statusText.innerHTML = "✅ This website is safe!";
                            statusText.style.color = "#00c853";
                        }
                    }, 1500); // Wait for 1.5 seconds before showing the result
                })
                .catch(error => {
                    setTimeout(() => {
                        loader.style.display = "none";
                        statusText.innerHTML = "⚠️ Error checking site safety!";
                        statusText.style.color = "#ffa000";
                        console.error("API Error:", error);
                    }, 1500);
                });
        });
    }

    // Run check on pop-up open
    checkWebsiteSafety();

    // Re-check when button is clicked
    checkButton.addEventListener("click", checkWebsiteSafety);
});
