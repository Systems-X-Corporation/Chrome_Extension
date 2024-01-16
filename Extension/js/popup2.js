let baseURL;

chrome.storage.local.get(["baseURL"], function (result) {
  console.log("URL =>", result.baseURL);
  baseURL = result.baseURL;
});
let pcn;
let authToken;
const main_control_panel = document.querySelector(".main_control_panel");
const pin_container = document.querySelector(".pin-div");

document.addEventListener("DOMContentLoaded", function () {
  const controlLink = document.querySelector(".p-tag");
  const maintenanceLink = document.querySelector(".panel-tag");
  const mainControlPanel = document.getElementById("inner_body");
  const maintenanceScreen = document.getElementById("maintenance_screen");

  controlLink.addEventListener("click", function () {
    mainControlPanel.style.display = "none";
    maintenanceScreen.style.display = "flex";
  });
  maintenanceLink.addEventListener("click", function () {
    mainControlPanel.style.display = "block";
    maintenanceScreen.style.display = "none";
  });
});

document.querySelector("#save_btn").addEventListener("click", function () {
  let fallbackSeconds = document.querySelector("#fallBack").value;
  let percent_rate = document.querySelector("#percentRate").value;
});

chrome.storage.local.get(["TokenValue", "pcn"]).then((result) => {
  pcn = result.pcn;
  authToken = result.TokenValue;
  fetch(`${baseURL}/verify-pcn`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Plexus_Customer_No: pcn,
      Token: authToken,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.exists) {
        document.getElementById("hieracyView").checked = true;
      }
      // chrome.runtime.sendMessage({ type: 'data', data: data.exists });
    })
    .catch((error) => console.error(error));
});
