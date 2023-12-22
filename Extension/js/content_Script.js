console.log("Content script loaded");
// localStorage.setItem("callAPI", false);

// var recordProductionButton =
//   document.querySelector(".plex-actions-wrapper ul#autoID81.plex-actions") ||
//   document.querySelector(".plex-actions-wrapper ul#autoID81.plex-actions");

// if (recordProductionButton) {
//   var liElements = recordProductionButton.querySelectorAll(
//     "li[data-bind*='isEnabled']"
//   );
//   console.log("liElements =>", liElements);

//   setTimeout(() => {
//     // liElements.forEach(function (liElement) {
//     console.log(liElements[0].classList);
//     if (liElements[0].classList.contains("disabled")) {
//       // alert("This li element has the disabled class!");
//       localStorage.setItem("recordProductionButtonDisabled", true);
//     } else {
//       localStorage.setItem("recordProductionButtonDisabled", false);
//     }
//     // });
//   }, 1000);
// }

// var myElements = document.querySelectorAll(".plex-actions-wrapper");

// myElements.forEach(function (myElement) {
//   var ulElement =
//     myElement.querySelector("ul#autoID82.plex-actions") ||
//     myElement.querySelector("ul#autoID81.plex-actions");

//   if (ulElement) {
//     setInterval(() => {
//       ulElement.click();
//     }, 10000);
//     // ulElement.addEventListener('click', function () {
//     //     // Handle the click event here
//     //     console.log('ulElement clicked!');
//     // });
//   }
// });

// main
const input_Field = document.getElementsByClassName("plex-numeric-text");
let inputValue;
const field_name = document.querySelectorAll(".plex-control-label div label");
let percentRate = localStorage.getItem("percentRate");
let variable2 = localStorage.getItem("variable2");
let fallbacksec = localStorage.getItem("fallbacksec");
const widgetHeaderData = document.querySelector(".widget-header-1").textContent;
console.log("Data from widget-header-1:", widgetHeaderData);

if (field_name[2].textContent == "Quantity per Container") {
  if (input_Field[1].value.length !== 0) {
    inputValue = input_Field[1].value;
  }
  input_Field[1].addEventListener("change", function () {
    // This function will be called when the input value changes
    if (input_Field[1].value.length !== 0) {
      inputValue = input_Field[1].value;
    }
    console.log("Extracted Value:", inputValue);
  });
}
if (field_name[1].textContent == "Production") {
  if (input_Field[0].value.length !== 0) {
    inputValue = input_Field[0].value;
  }
  input_Field[0].addEventListener("change", function () {
    // This function will be called when the input value changes
    if (input_Field[0].value.length !== 0) {
      inputValue = input_Field[0].value;
    }
    console.log("Extracted Value:", inputValue);
  });
}
const callAPI = localStorage.getItem("callAPI");
console.log("callAPI", callAPI);
if (callAPI === "true" && callAPI !== undefined) {
  let tableandrowelement = document.createElement("div");
  tableandrowelement.setAttribute("id", "record_button");
  tableandrowelement.style.top = "-40px";
  tableandrowelement.style.position = "relative";
  tableandrowelement.style.width = "211px";
  // tableandrowelement.innerHTML = `<a style="padding: 6px 10px;" class=" ${localStorage.getItem("recordProductionButtonDisabled")? "button_new": "record-production-actionbar-button"}"><i class="plex-actionbar-icon record-production-action-icon plex-icon-cp-record-production" data-bind="css: $data.iconClass"></i><span class="record-production-action-title" data-bind="text: $data.text">${localStorage.getItem("recordProductionButtonDisabled")? "Plex Disabled": "Record Production" }</span></a>`;
  tableandrowelement.innerHTML = `
  <a style="padding: 6px 10px;" class=" button_new record-production-actionbar-button">
<i class="plex-actionbar-icon record-production-action-icon plex-icon-cp-record-production" data-bind="css: $data.iconClass"></i>
<span class="record-production-action-title" data-bind="text: $data.text">Record Production</span>
</a>`;
  let pixcelSearchResult = document.querySelectorAll(".plex-actions");

  pixcelSearchResult.forEach((element) => {
    element.append(tableandrowelement);
  });

  tableandrowelement.addEventListener("click", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("WorkcenterKey");
    const data = await chrome.storage.local.get(["pcnName"]);
    console.log("pcnName", data.pcnName);
    const pcnName = data.pcnName;
    // Create the data to send in the POST request
    var dataToSend = {
      workcenter_no: widgetHeaderData,
      pcs: inputValue,
      percent_of_rate: percentRate,
      workcenter_rate: variable2,
      Workcenter_Key: myParam,
      pcnName: pcnName,
    };

    console.log("Data to send in the POST request:", dataToSend);

    const callAPI = localStorage.getItem("callAPI");

    console.log("result.callAPI =>", callAPI === "true");
    // if (localStorage.getItem("recordProductionButtonDisabled") === false) {
    if (
      callAPI !== undefined &&
      callAPI === "true" &&
      !localStorage.getItem("fallbacksec")
    ) {
      console.log("hello");
      recordProductionButton.click();
      fetch("https://backendphase2.azurewebsites.net/cooldown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then(async (response) => {
          // console.log("response", await response.json());
          let ApiResponse = await response.json();
          console.log("ApiResponse", ApiResponse);
          let cooldown_no = ApiResponse.cooldown_no;
          // console.log("cooldown_no", cooldown_no);
          // console.log("cooldown_no", Math.ceil(cooldown_no));
          // console.log("API Response Status:", response.status);
          // console.log("API Response:", response);
          if (response.status == 200) {
            let popuptimer = document.getElementById("popup_timer");
            popuptimer.style.display = "flex";
            if (cooldown_no > 0) {
              const time = Math.ceil(cooldown_no);
              setTimer(time);
            } else {
              setTimeout(() => {
                popuptimer.style.display = "none";
              }, 1000);
            }
          } else {
            console.log("Error:", response.status);
            // popuptimer.style.display = "none";
          }
          console.log("finale response =>", ApiResponse);
          return await ApiResponse;
        })
        .then((data) => {
          console.log("API Response:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if ((await localStorage.getItem("fallbacksec").length) !== 0) {
      let ApiResponse = localStorage.getItem("fallbacksec");
      console.log("ApiResponse", ApiResponse);
      let cooldown_no = ApiResponse;
      // console.log("cooldown_no", cooldown_no);
      // console.log("cooldown_no", Math.ceil(cooldown_no));
      // console.log("API Response Status:", response);
      let popuptimer = document.getElementById("popup_timer");
      popuptimer.style.display = "flex";
      const time = Math.ceil(cooldown_no);
      setTimer(time);
    }

    // }
  });
}
let popuptimer = document.createElement("div");
popuptimer.setAttribute("id", "popup_timer");
popuptimer.style.position = "absolute";
popuptimer.style.width = "100vw";
popuptimer.style.height = "100vh";
popuptimer.style.backgroundColor = "rgb(255, 0, 0, 0.5)";
popuptimer.style.color = "black";
popuptimer.style.textAlign = "center";
popuptimer.style.justifyItems = "center";
popuptimer.style.alignItems = "center";
popuptimer.style.display = "none";
popuptimer.style.zIndex = "1";
popuptimer.style.justifyContent = "center";
popuptimer.innerHTML = `
  <div style="
  opacity: 1;
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  padding: 50px;
">You are not allowed to record production<br>Time to record production again:<br><div><span id = "countdown">0</span>(Countdown)</div></div>
`;
let popup_div = document.querySelector("#autoID1_persistentBanner");
popup_div.prepend(popuptimer);

function setTimer(time) {
  var x = setInterval(function () {
    document.getElementById("countdown").innerHTML = time + "s ";
    time--;
    if (time < 0) {
      if (popuptimer) {
        popuptimer.style.display = "none";
      }
      clearInterval(x);
    }
  }, 1000);
}

let popupwindow = document.createElement("div");
popupwindow.setAttribute("id", "popup_alert");
popupwindow.style.position = "absolute";
popupwindow.style.width = "100vw";
popupwindow.style.height = "100vh";
popupwindow.style.backgroundColor = "rgb(255, 0, 0, 0.5)";
popupwindow.style.color = "black";
popupwindow.style.textAlign = "center";
popupwindow.style.justifyItems = "center";
popupwindow.style.alignItems = "center";
popupwindow.style.display = "none";
popupwindow.style.zIndex = "1";
popupwindow.style.justifyContent = "center";
// Show table is by default checked
popupwindow.innerHTML = `<div style="opacity: 1;text-align: center;align-items: center;display: flex;font-size: 30px;font-weight: 600;padding: 50px;">To continue on this screen, you must activate your chrome extension. Please contact your IT support.</div>`;

if (popup_div) {
  popup_div.prepend(popupwindow);
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("message", message);
  if (message.isChecked) {
    let isChecked = message.isChecked;
    console.log("Checkbox is checked.", isChecked);
    popupwindow.style.display = "flex";
    localStorage.setItem("callAPI", !isChecked);
    console.log("callAPI =>", localStorage.getItem("callAPI"));
  }
  if (message.isCheckedTrue) {
    let isCheckedTrue = message.isCheckedTrue;
    console.log("Checkbox is checked.", isCheckedTrue);
    localStorage.setItem("callAPI", isCheckedTrue);
    console.log("callAPI =>", localStorage.getItem("callAPI"));
  }
  if (message.message === "recordProduction") {
    const recordProduction = message.data;
    console.log("recordProduction =>", recordProduction);
    localStorage.setItem("callAPI", recordProduction.callAPICheck);

    localStorage.setItem("percentRate", recordProduction.percentRate);
    localStorage.setItem("variable2", recordProduction.letiable2);
    localStorage.setItem("fallbacksec", recordProduction.fallbacksec);

    // // Access the values from the message
    // percentRate = recordProduction.percentRate;
    // variable2 = recordProduction.letiable2;
    // fallbacksec = recordProduction.fallbacksec;

    // Now you can use these values in your content script
    console.log("Received percentRate:", localStorage.getItem("percentRate"));
    console.log("Received variable2:", localStorage.getItem("variable2"));
    console.log("Received fallbacksec:", localStorage.getItem("fallbacksec"));
    popupwindow.style.display = "none";
    window.location.reload();
    // Do whatever you need to with these values in your content script.
  }
});

// load window
chrome.storage.local.get(["ShowTree"]).then((result) => {
  console.log("checking result for screen=>", result);
  if (result.ShowTree !== true || !result.ShowTree) {
    popupwindow.style.display = "flex";
    // localStorage.setItem("percentRate", "");
    // localStorage.setItem("variable2", "");
    // localStorage.setItem("fallbacksec", "");
  }
});
