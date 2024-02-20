// background.js
// const Switch = "dev";
const Switch = "pro";

chrome.storage.local.set({
  baseURL:
    Switch === "dev"
      ? "http://localhost:8000"
      : "https://backendphase2.azurewebsites.net",
});
chrome.tabs.onActivated.addListener(async function (info) {
  console.log("info.tabId", info.tabId);
  // Send message to popup to hide extension content
  // chrome.runtime.sendMessage({
  //   type: "showExtensionContent",
  //   showExtensionContent: false,
  // });
  // =================================== Save page url to local storage ===============================================
  // await chrome.storage.local.set({
  //   showExtensionContent: false,
  // });
  // Get current page Url from local storage if exists
  let data = await chrome.storage.local.get("currentPageUrl");
  console.log("data.currentPageUrl", data.currentPageUrl);
  const tab = await chrome.tabs.get(info.tabId);
  let regexPattern =
    /^https?:\/\/.*\.plex\.com\/(?:Maintenance\/WorkRequests\/ViewWorkRequestForm|ControlPanel(?:\/Production\?WorkcenterKey)?).*$/;
  console.log("tab.url", tab.url);
  if (
    (regexPattern.test(tab.url) ||
      tab.url.includes("https://test.cloud.plex.com/ControlPanel")) &&
    !tab.url.includes("https://test.cloud.plex.com/Platform")
  ) {
    // Send message to popup to show extension content
    // chrome.runtime.sendMessage({
    //   type: "showExtensionContent",
    //   showExtensionContent: true,
    // });
    // =================================== Save page url to local storage ===============================================
    // await chrome.storage.local.set({
    //   showExtensionContent: true,
    // });
    // If currentPageUrl from local storage is === tab.url then do nothing
    // else set the value of currentPageUrl to be equal to tab.url in local storage and reload that page
    if (data.currentPageUrl !== tab.url) {
      await chrome.storage.local.set({
        currentPageUrl: tab.url,
      });
      console.log("tab", tab);
      chrome.tabs.reload(tab.id);
    }
  }
});
// ================================================

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  console.log("tabId", tabId);
  // Send message to popup to hide extension content
  // chrome.runtime.sendMessage({
  //   type: "showExtensionContent",
  //   showExtensionContent: false,
  // });
  // =================================== Save page url to local storage ===============================================
  // await chrome.storage.local.set({
  //   showExtensionContent: false,
  // });
  // Get current page Url from local storage if exists
  let data = await chrome.storage.local.get("currentPageUrl");
  console.log("data.currentPageUrl", data.currentPageUrl);
  const tabDetails = await chrome.tabs.get(tabId);
  let regexPattern =
    /^https?:\/\/.*\.plex\.com\/(?:Maintenance\/WorkRequests\/ViewWorkRequestForm|ControlPanel(?:\/Production\?WorkcenterKey)?).*$/;
  console.log("tabDetails.url", tabDetails.url);
  if (
    regexPattern.test(tabDetails.url) ||
    tabDetails.url.includes("https://test.cloud.plex.com/ControlPanel")
  ) {
    // Send message to popup to show extension content
    // chrome.runtime.sendMessage({
    //   type: "showExtensionContent",
    //   showExtensionContent: true,
    // });
    // =================================== Save page url to local storage ===============================================
    // await chrome.storage.local.set({
    //   showExtensionContent: true,
    // });
    // If currentPageUrl from local storage is === tabDetails.url then do nothing
    // else set the value of currentPageUrl to be equal to tabDetails.url in local storage and reload that page
    if (data.currentPageUrl !== tabDetails.url) {
      await chrome.storage.local.set({
        currentPageUrl: tabDetails.url,
      });
      console.log("tabDetails", tabDetails);
      chrome.tabs.reload(tabDetails.id);
    }
  }
});
