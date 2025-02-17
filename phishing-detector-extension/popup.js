document.addEventListener("DOMContentLoaded", function () {
    let statusText = document.getElementById("status");
    let loader = document.querySelector(".loader");
    let checkButton = document.getElementById("checkButton");

    

    const API_KEY = "API_KEY";  
    const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

    function getActiveTabUrl(callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                callback(tabs[0].url);
            }
        });
    }

    function speakText(text) {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel(); // Stops any ongoing speech
            let utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "en-US";
            utterance.rate = 1.0; // Normal speed
            utterance.pitch = 1.0; // Normal pitch
            speechSynthesis.speak(utterance);
            console.log("Speaking:", text);
        } else {
            console.error("Text-to-Speech not supported in this browser.");
        }
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
                            let message = "Warning! This might be a phishing site!";
                            statusText.innerHTML = `⚠️ ${message}`;
                            statusText.style.color = "#ff1744";
                            speakText(message);
                        } else {
                            let message = "This website is safe.";
                            statusText.innerHTML = `✅ ${message}`;
                            statusText.style.color = "#00c853";
                            speakText(message);
                        }
                    }, 1500); // Waits 1.5 seconds before showing result
                })
                .catch(error => {
                    setTimeout(() => {
                        let message = "Error checking site safety.";
                        loader.style.display = "none";
                        statusText.innerHTML = `⚠️ ${message}`;
                        statusText.style.color = "#ffa000";
                        console.error("API Error:", error);
                        speakText(message);
                    }, 1500);
                });
        });
    }

    // Runs check on pop-up open
    checkWebsiteSafety();

    // Re-checks when button is clicked
    checkButton.addEventListener("click", checkWebsiteSafety);
});
