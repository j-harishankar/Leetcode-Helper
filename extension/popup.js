console.log("📦 popup.js loaded");
document.getElementById("getHelp").addEventListener("click", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    const title = tab.title;

    console.log("LeetCode URL:", url);
    console.log("Problem Title:", title);

    // For tomorrow: send to Django here
    fetch("http://127.0.0.1:8000/api/solve/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title,
      url: url
    })
  })
  .then(response => response.json())
  .then(data => console.log("✅ Response from Django:", data))
  .catch(error => console.error("❌ Error:", error));

  });
});
