console.log("📦 popup.js loaded");

document.getElementById("getHelp").addEventListener("click", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    const title = tab.title;

    console.log("LeetCode URL:", url);
    console.log("Problem Title:", title);

    const response = await fetch("http://127.0.0.1:8000/api/solve/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, url })
    });

    const data = await response.json();
    console.log("✅ Response from Django:", data);

    const output = document.getElementById("output");
    output.innerHTML = "";

    if (data.steps && Array.isArray(data.steps)) {
      data.steps.forEach((step, index) => {
        const li = document.createElement("li");
        li.textContent = step;
        output.appendChild(li);
      });
    } else {
      output.innerHTML = "<p>No steps found.</p>";
    }
  });
});
