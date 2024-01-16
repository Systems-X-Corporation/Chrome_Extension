// background.js
// const Switch = "dev";
const Switch = "pro"

chrome.storage.local.set({
  baseURL:
    Switch === "dev"
      ? "http://localhost:8000"
      : "https://backendphase2.azurewebsites.net",
});