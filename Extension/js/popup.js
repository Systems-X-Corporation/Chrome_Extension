let baseURL;

chrome.storage.local.get(["baseURL"], function (result) {
  console.log("URL =>", result.baseURL);
  baseURL = result.baseURL;
});
// ==================================================== dom loading functions ============================================
// as soon as extension loads  we need this to be done
document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(["ShowTree"]).then((result) => {
    console.log("checking result for screen=>", result);
    setTimeout(() => {
      console.log(
        "document.getElementById('isverify').innerHTML=>",
        document.getElementById("isverify").innerHTML
      );
      if (
        result.ShowTree !== true ||
        result.ShowTree === false ||
        document.getElementById("isverify").innerHTML !== "Verified Token"
      ) {
        console.log("enter first time!");
        let extension_heading = document.querySelector("#extension_heading");
        // extension_heading.innerHTML = "Turn On Extension";
        const tokensavebtn = document.getElementById("tokensavebtn");
        tokensavebtn.disabled = true;
        tokensavebtn.style.cursor = "default";
        const settingsBtn = document.getElementById("settings");
        settingsBtn.disabled = true;
        settingsBtn.style.cursor = "default";
        // document.getElementById("settings").disabled = true;
        // settingsBtn.disabled = true;
        // settingsBtn.style.cursor = "default";
        // tokensavebtn.disabled = true;
        // tokensavebtn.style.cursor = "default";
        // document.getElementById("settings").disabled = true;
      }
    }, 1000);
  });
  // if ((document.getElementById("isverify").innerHTML = "Verified Token")) {
  //   const settingsBtn = document.getElementById("settings");
  //   // document.getElementById("settings").disabled = true;
  //   settingsBtn.disabled = true;
  //   settingsBtn.style.cursor = "default";
  // } else {
  //   const settingsBtn = document.getElementById("settings");
  //   // document.getElementById("settings").disabled = true;
  //   settingsBtn.disabled = false;
  //   settingsBtn.style.cursor = "pointer";
  // }
});
document.addEventListener("DOMContentLoaded", function () {
  const navigatePanel = document.getElementById("settings");
  const iframeContainer = document.getElementById("main_control_panel");
  const mainControlPanel = document.getElementById("Wrapper_div_Extension");
  const innerBody = document.querySelector(".production_container");

  const cpDiv = document.querySelector(".cp-div");
  navigatePanel.addEventListener("click", function (event) {
    console.log("clicked");
    mainControlPanel.style.display = "none";
    cpDiv.style.display = "flex";
    iframeContainer.style.display = "flex";
    // innerBody.style.display = "none";
    chrome.storage.local.get(["Values"], function (result) {
      if (chrome.runtime.lastError) {
        console.error("Error getting values:", chrome.runtime.lastError);
      } else {
        console.log("Result:", result);
        let retrievedValues = result.Values;
        console.log("Retrieved Values:", retrievedValues);
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const controlPanel = document.querySelector(".panel-tag");
  const myCheckbox = document.getElementById("myCheckbox");
  const innerBody = document.querySelector(".production_container");

  // const innerBody = document.querySelector(".production_container");
  const cpDiv = document.querySelector(".cp-div");
  const heirarchy = document.getElementById("maintenance_screen");
  controlPanel.addEventListener("click", function (event) {
    console.log("clicked");
    // innerBody.style.display = 'flex';
    heirarchy.style.display = "none";
    cpDiv.style.display = "flex";
    innerBody.style.display = myCheckbox.checked ? "flex" : "none";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const myCheckbox = document.getElementById("myCheckbox");
  const innerBody = document.querySelector(".production_container");
  const pinDiv = document.querySelector(".pin-div");
  const cpDiv = document.querySelector(".cp-div");
  const Nav = document.querySelector(".nav-tags");
  console.log("myCheckbox.checked 243", myCheckbox.checked);
  if (myCheckbox.checked) {
    // Checkbox is checked initially, so display the elements.
    innerBody.style.display = "flex";
    pinDiv.style.display = "none";
    cpDiv.style.display = "block";
    Nav.style.display = "block";
  } else {
    // Checkbox is unchecked initially, so hide the elements.
    innerBody.style.display = "none";
    // pinDiv.style.display = "flex";
    cpDiv.style.display = "none";
    Nav.style.display = "none";
  }

  // Event listener for checkbox click
  myCheckbox.addEventListener("click", function () {
    const isChecked = myCheckbox.checked;
    innerBody.style.display = isChecked ? "flex" : "none";
    pinDiv.style.display = isChecked ? "none" : "block";
    cpDiv.style.display = isChecked ? "block" : "none";
    Nav.style.display = isChecked ? "block" : "none";

    // saveCheckboxState(isChecked); // Save the checkbox state when clicked
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const cpDiv = document.querySelector(".cp-div");
  const heirarchy = document.getElementById("maintenance_screen");
  const innerBody = document.querySelector(".production_container");
  const Ptag = document.querySelector(".p-tag");
  const myCheckbox = document.getElementById("myCheckbox");

  Ptag.addEventListener("click", function (event) {
    console.log("clicked");
    heirarchy.style.display = "flex";
    cpDiv.style.display = "none";
    innerBody.style.display = "none";
    // Checkbox.checked = checkbox;
  });
});

// ============================================ utility functions ==================================
const getCurrentTab = new Promise((resolve, reject) => {
  // setTimeout(() => {
  //   resolve("foo");
  // }, 300);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("tabs[0]", tabs[0]);
    console.log("tabs[0].id", tabs[0].id);
    // chrome.tabs.update(tab.id, { url: tab.url });
    // chrome.tabs.reload(tabs[0].id);
    // chrome.tabs.reload(tabs[0].id);
    // return tabs[0];
    resolve(tabs[0]);
    // chrome.tabs.sendMessage(tabs[0].id, { isChecked: true });
  });
});

// verify pcn number by calling api
const verifyPcn = async (enteredPIN) => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let raw = JSON.stringify({
    Pcn_No: pcnValue,
    Pin: enteredPIN,
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  console.log(raw);
  let apiResult = await fetch(`${baseURL}/verify-pin`, requestOptions);
  apiResult = await apiResult.json();
  return apiResult;
};
// ============================================================ End of Utility functions =====================================================

let input = document.getElementById("Token_input");
let checkbox = document.getElementById("EquipmentCheck");
let pcn;
let pcnValue;
chrome.storage.local.get(["pcn"], function (result) {
  pcnValue = result.pcn;
  console.log("Value of pcn:", pcnValue);
});
// Creating new window for cloud.plex on click
document.querySelector("#plexux").addEventListener("click", function () {
  window.open("https://cloud.plex.com/", "_blank").focus();
});
// Creating new window for plexonline on click
document.querySelector("#plexclassic").addEventListener("click", function () {
  window.open("https://www.plexonline.com/", "_blank").focus();
});
let button = document.getElementById("tokensavebtn");

document.getElementById("Token_input").addEventListener("input", () => {
  if (input.value.trim() !== "") {
    button.disabled = false;
    checkbox.disabled = false;
    checkbox.style.cursor = "pointer";
    button.style.backgroundColor = "#2c6e3a";
    button.style.cursor = "pointer";
    button.style.color = "white";
    button.style.border = "2px solid white";
  } else {
    button.disabled = true;
    checkbox.disabled = true;
    checkbox.style.cursor = "default";
    button.style.backgroundColor = "#5a8e65";
    button.style.cursor = "default";
    button.style.border = "2px solid #fa8178";
  }
});

// Saving the token value in save btn
document
  .querySelector("#tokensavebtn")
  .addEventListener("click", async function () {
    let value = document.querySelector("#Token_input").value;
    // Save the token in local storage
    chrome.storage.local.set({ TokenValue: value }).then(() => {});
    // Reloading the page after click
    location.reload();
    let tab = await getCurrentTab;
    // chrome.tabs.update(tab.id, { url: tab.url });
    chrome.tabs.reload(tab.id);
  });

// Getting the token and placing it into popup token input
chrome.storage.local.get(["TokenValue"]).then((result) => {
  console.log("RESSULLT", result);
  Token = result.TokenValue;

  if (Token) {
    input.value = Token;
  }
  if (input.value.trim() !== "") {
    button.disabled = false;
    checkbox.disabled = false;
    checkbox.style.cursor = "pointer";
    button.style.backgroundColor = "#2c6e3a";
    button.style.cursor = "pointer";
    button.style.color = "white";
    button.style.border = "2px solid white";
  } else {
    button.disabled = true;
    checkbox.disabled = false;
    checkbox.style.cursor = "pointer";
    button.style.backgroundColor = "#5a8e65";
    button.style.cursor = "default";
    button.style.border = "2px solid #fa8178";
  }
});

// let checkbox = document.querySelector("#EquipmentCheck");

// Getting the checkbox value and setting as default
chrome.storage.local.get(["ShowTree"]).then((result) => {
  console.log("checkboxvalue ===>", result);
  let checkboxvalue = result.ShowTree;
  console.log("===>checkboxvalue ", checkboxvalue);
  if (checkboxvalue) {
    checkbox.checked = true;
  } else if (!checkboxvalue) {
    checkbox.checked = false;
  }
});

// chrome.storage.local.get(["ShowPopup"]).then((result) => {
//   console.log("ShowPopup checkboxvalue ===>", result);
//   let checkboxvalue = result.ShowPopup;
//   console.log("checkboxvalue ShowPopup ===>", checkboxvalue);
//   checkbox.checked = checkboxvalue;
// });

// Eventlistner for Checkbox
checkbox.addEventListener("change", async function () {
  if (this.checked) {
    // Setting the checkbox value to local storage
    // =============================================================================
    // chrome.storage.local.set({ ShowTree: true }).then(() => {});
    // chrome.storage.local.get(["ShowTree"]).then((result) => {
    //   console.log("result tree", result);
    // });
    // =============================================================================
    // chrome.storage.local.set({ ShowPopup: true }).then(() => {});
    // chrome.storage.local.get(["ShowPopup"]).then((result) => {});
    // Reloading the page after click
    // let tab = await getCurrentTab;
    // // chrome.tabs.update(tab.id, { url: tab.url });
    // chrome.tabs.reload(tab.id);
    // const settingsBtn = document.getElementById("settings");
    // // document.getElementById("settings").disabled = true;
    // settingsBtn.disabled = false;
    // settingsBtn.style.cursor = "pointer";
    // let function_box = document.querySelector("#input_area_token");
    // function_box.style.visibility = "visible";
    // let extension_heading = document.querySelector("#extension_heading");
    // extension_heading.style.fontWeight = "600";
    // extension_heading.style.width = "";
    // extension_heading.style.top = "";
    // extension_heading.style.position = "";
    // extension_heading.style.textAlign = "";
    // extension_heading.innerHTML = "SYSTEMS X CONNECT";
    // Setting the checkbox value to local storage
    // chrome.storage.local.set({ ShowTree: true }).then(() => {});
    // chrome.storage.local.get(["ShowTree"]).then((result) => {});
    // chrome.storage.local.set({ ShowPopup: true }).then(() => {});
    // chrome.storage.local.get(["ShowPopup"]).then((result) => {});
    const Wrapper_div_Extension = document.getElementById(
      "Wrapper_div_Extension"
    );
    Wrapper_div_Extension.style.display = "none";
    let pin_div = document.getElementById("pin-div");
    pin_div.style.display = "block";
    // Send a message to the content script
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   console.log("tabs[0].id", tabs[0].id);
    //   chrome.tabs.sendMessage(tabs[0].id, {
    //     action: "doSomething",
    //     data: "Hello from popup!",
    //   });
    // });
  } else {
    // Setting the checkbox value to local storage
    chrome.storage.local.set({ ShowTree: false }).then(() => {});
    chrome.storage.local.get(["ShowTree"]).then((result) => {
      console.log("result tree sending message and screen come's", result);
    });
    // chrome.storage.local.set({ ShowPopup: false }).then(() => {});
    // chrome.storage.local.get(["ShowPopup"]).then((result) => {});
    // Reloading the page after click
    let tab = await getCurrentTab;
    // chrome.tabs.update(tab.id, { url: tab.url });
    chrome.tabs.sendMessage(tab.id, { isChecked: true });
    // const pin_container = document.getElementById("pin-container");
    // pin_container.style.flexDirection = "column"
    let extension_heading = document.querySelector("#extension_heading");
    // extension_heading.innerHTML = "Turn On Extension";
    const settingsBtn = document.getElementById("settings");
    // document.getElementById("settings").disabled = true;
    settingsBtn.disabled = true;
    settingsBtn.style.cursor = "default";
    const tokensavebtn = document.getElementById("tokensavebtn");
    tokensavebtn.disabled = true;
    tokensavebtn.style.cursor = "default";
    // let function_box = document.querySelector("#input_area_token");
    // function_box.style.visibility = "hidden";
    console.log(document.getElementById("EquipmentCheck"));
  }
  console.log("all time ===>", document.getElementById("EquipmentCheck"));
});

document.querySelector("#quicktoolimg").addEventListener("click", function () {
  window
    .open(
      "https://www.systems-x.com/en-us/contact-us?hsCtaTracking=e9deae1e-b808-45f9-8eb5-58b99ac20974%7C42c15435-0f3e-4a85-8c8b-d0ab8be4fe67"
    )
    .focus();
});
chrome.storage.local.get(["TokenValue", "pcn"]).then((result) => {
  pcn = result.pcn;
  authToken = result.TokenValue;
  console.log("REULT", result);
  if (authToken) {
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
        console.log("data", data);
        // changes made here
        chrome.storage.local.get(["ShowTree"]).then((result) => {
          console.log("checking result for screen=>", result);
          if (result.ShowTree) {
            // changes ends here
            if (data.exists) {
              document.getElementById("isverify").innerHTML = "Verified Token";
              const settingsBtn = document.getElementById("settings");
              // document.getElementById("settings").disabled = true;
              settingsBtn.disabled = false;
              settingsBtn.style.cursor = "pointer";
            } else {
              document.getElementById("isverify").innerHTML =
                "Invalid Token \n Please enter token to proceed!";
              const settingsBtn = document.getElementById("settings");
              // document.getElementById("settings").disabled = true;
              settingsBtn.disabled = true;
              settingsBtn.style.cursor = "default";
              const tokensavebtn = document.getElementById("tokensavebtn");
              tokensavebtn.disabled = true;
              tokensavebtn.style.cursor = "default";
            }
            // changes made here
          } else {
            document.getElementById("isverify").innerHTML = "Extension is off!";
            document.getElementById("Token_input").innerHTML = "";
          }
        });
        // changes ends here
        // chrome.runtime.sendMessage({ type: 'data', data: data.exists });
      })
      .catch((error) => console.error(error));
  }
});

let checkBox = document.getElementById("myCheckbox");
chrome.storage.local.get(["controlPanelCheck"]).then(async (result) => {
  console.log("controlPanelCheck =>", result.controlPanelCheck);
  // let checkBox = document.getElementById("myCheckbox");
  if (result.controlPanelCheck !== undefined) {
    checkBox.checked = result.controlPanelCheck;
    // const pinDiv = document.querySelector(".pin-div");
    // pinDiv.style.display = "none";
  } else {
    checkBox.checked = true;
  }
});

checkBox.addEventListener("click", function () {
  console.log("checkBox.checked ==>", checkBox.checked);
  let isChecked = checkBox.checked;
  console.log("isChecked ===>", isChecked);
  chrome.storage.local.set({ controlPanelCheck: isChecked });

  if (!isChecked) {
    chrome.tabs.query(
      { url: ["*://cloud.plex.com/*", "*://test.cloud.plex.com/*"] },
      function (tabs) {
        tabs.forEach(function (tab) {
          console.log("tabs[0]", tab);
          if (tab) {
            chrome.tabs.sendMessage(tab.id, { isChecked: !isChecked });
          }
        });
        // Make sure there's an active tab
      }
    );
  } else if (isChecked === true) {
    chrome.tabs.query(
      { url: ["*://cloud.plex.com/*", "*://test.cloud.plex.com/*"] },
      function (tabs) {
        // Make sure there's an active tab
        tabs.forEach(function (tab) {
          console.log("tabs[0]", tab);
          if (tab) {
            chrome.tabs.sendMessage(tab.id, { isCheckedTrue: true });
          }
        });
      }
    );
  }
});

const CancelBtn = document.getElementById("cancle_btn");

CancelBtn.addEventListener("click", function (e) {
  CancelBtn.style.backgroundColor = "#D33D28";
  CancelBtn.style.color = "white";
});
// const checkbox = document.querySelector('.c-box');

// checkbox.addEventListener('change', function() {
//   if (checkbox.checked) {
//     this.style.backgroundColor = 'blue';
//   } else {
//     checkbox.style.backgroundColor = 'white';
//   }
// });
document.getElementById("pin1").onkeyup = function () {
  if (this.value.length === 1 && !isNaN(this.value)) {
    document.getElementById("pin2").focus();
  }
};

document.getElementById("pin2").onkeyup = function () {
  if (this.value.length === 1 && !isNaN(this.value)) {
    document.getElementById("pin3").focus();
  }
};

document.getElementById("pin3").onkeyup = function () {
  if (this.value.length === 1 && !isNaN(this.value)) {
    document.getElementById("pin4").focus();
  }
};

document.addEventListener("DOMContentLoaded", function () {
  try {
    const pinDiv = document.querySelector(".pin-div");
    const Nav = document.querySelector(".nav-tags");
    const innerBody = document.querySelector(".production_container");
    const Savebtn = document.getElementById("save_btn");
    const cpDiv = document.querySelector(".cp-div");

    Savebtn.addEventListener("click", function () {
      // Get the input elements you want to validate
      const input1 = document.getElementById("percentRate"); // Replace "input1" with the actual ID of your input field
      const input2 = document.getElementById("fallBack"); // Replace "input2" with the actual ID of your input field

      // Check if input1 has a value and a radio button is selected
      const radioButtons = document.getElementsByName("workcenter");
      let selectedCount = 0;

      for (const radioButton of radioButtons) {
        if (radioButton.checked) {
          selectedCount++;
        }
      }

      if (
        (input1.value.trim() !== "" && selectedCount > 0) ||
        input2.value.trim() !== ""
      ) {
        console.log("Button clicked");
        pinDiv.style.display = "block";
        Nav.style.display = "none";
        cpDiv.style.display = "none";
        innerBody.style.display = "none";
      } else {
        // alert("Either fill input1 and select a radio button or fill input2.");
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

const pinInputs = document.querySelectorAll(".pin-input");
console.log(pinInputs);
const submitBtn = document.querySelector("#submitBtn");
console.log(submitBtn);
let correctPIN = []; // Change this to your correct PIN
const Savebtn = document.getElementById("save_btn");
const innerBody = document.querySelector(".production_container");
const pinDiv = document.querySelector(".pin-div");
const cpDiv = document.querySelector(".cp-div");
const myCheckbox = document.getElementById("myCheckbox");
const Nav = document.querySelector(".nav-tags");
// const SB2 = document.getElementById("submitBtn2");

submitBtn.addEventListener("click", async () => {
  const enteredPIN = Array.from(pinInputs)
    .map((input) => input.value)
    .join("");
  clearPINInputs();
  let result = await verifyPcn(enteredPIN);
  console.log("resukt", result);
  if (result.message === "You are authorized") {
    innerBody.style.display = "flex";
    pinDiv.style.display = "none";
    cpDiv.style.display = "flex";
    Nav.style.display = "flex";
    console.log("Correct PIN:", enteredPIN);
    const isChecked = myCheckbox.checked;

    // Check if myCheckbox is unchecked and hide innerBody if it is
    if (!isChecked) {
      innerBody.style.display = "none";
    } else {
      innerBody.style.display = "flex";
      Savebtn.innerHTML = "✓ Saved";
      Savebtn.disabled = true;
      Savebtn.style.backgroundColor = "#157C36";
      Savebtn.style.color = "white";
    }

    document.getElementById("authMessage1").style.display = "block";
    document.getElementById("authMessage1").innerHTML = "You're authorized";
    // document.getElementById('authMessage').style.display = "none";
    // Get the input value
    let percentRate = document.getElementById("percentRate").value;

    let fallBack = document.getElementById("fallBack").value;

    // Get the values of selected radio buttons
    let workcenterCheckboxes = document.querySelectorAll(
      'input[name="workcenter"]:checked'
    );
    let workcenterValues = [];
    workcenterCheckboxes.forEach(function (checkbox) {
      workcenterValues.push(checkbox.value);
    });

    // Create an object to store the values
    let valuesToStore = {
      PercentRate: percentRate,
      Workcentre: workcenterValues,
      Fallback: fallBack,
    };

    // Store the values in Chrome storage
    chrome.storage.local.set({ Values: valuesToStore }, function () {
      if (chrome.runtime.lastError) {
        console.error("Error setting values:", chrome.runtime.lastError);
      } else {
        console.log("Values stored successfully");
        sendMessageOnSave();
      }
    });

    console.log("PercentRate:", percentRate);
    console.log("Workcenter:", workcenterValues);
    console.log("Fallback:", fallBack);

    // Retrieve the values from Chrome storage
    chrome.storage.local.get(["Values"], function (result) {
      if (chrome.runtime.lastError) {
        console.error("Error getting values:", chrome.runtime.lastError);
      } else {
        console.log("Result:", result);
        let retrievedValues = result.Values;
        console.log("Retrieved Values:", retrievedValues);
      }
    });

    // below code will work in where ==>  extension is in off state and tried to turn on.
    chrome.storage.local.get(["ShowTree"]).then(async (result) => {
      console.log("result tree sending message and screen come's", result);
      if (result.ShowTree === false || result.ShowTree !== true) {
        console.log("inside of if..");
        chrome.storage.local.set({ ShowTree: true }).then(() => {});
        chrome.storage.local.get(["ShowTree"]).then((result) => {});
        let tab = await getCurrentTab;
        // chrome.tabs.update(tab.id, { url: tab.url });
        const settingsBtn = document.getElementById("settings");
        // document.getElementById("settings").disabled = true;
        settingsBtn.disabled = false;
        settingsBtn.style.cursor = "pointer";
        let function_box = document.querySelector("#input_area_token");
        function_box.style.visibility = "visible";
        let extension_heading = document.querySelector("#extension_heading");
        extension_heading.style.fontWeight = "600";
        extension_heading.style.width = "";
        extension_heading.style.top = "";
        extension_heading.style.position = "";
        extension_heading.style.textAlign = "";
        extension_heading.innerHTML = "SYSTEMS X CONNECT";
        chrome.storage.local.set({ ShowTree: true }).then(() => {});
        chrome.storage.local.get(["ShowTree"]).then((result) => {
          console.log("result tree", result);
          chrome.tabs.reload(tab.id);
          window.close();
        });
      }
    });
  } else if (result.message === "You are Unauthorized") {
    // Incorrect PIN
    clearPINInputs();

    document.getElementById("authMessage").innerHTML = "You're unauthorized";
    // document.getElementById('authMessage1').innerHTML = 'You are not authorized';
  }
  // console.log(enteredPIN);
  // document.getElementById("authMessage").innerHTML = "";
  // if (enteredPIN === correctPIN) {
  //   innerBody.style.display = "flex";
  //   pinDiv.style.display = "none";
  //   cpDiv.style.display = "flex";
  //   console.log("Correct PIN:", correctPIN);
  //   // submitBtn.addEventListener("click", function () {
  //   //   // Savebtn.addEventListener("click", function () {
  //   Savebtn.innerHTML = "Saved";
  //   Savebtn.disabled = true;
  //   Savebtn.style.backgroundColor = "rgba(21, 124, 54, 1)";
  //   document.getElementById("authMessage").style.display = "none";
  //   //   // });
  //   // });
  //   // alert('Correct PIN! Access granted.');
  // } else {
  //   clearPINInputs();
  //   // document.getElementById('authMessage').innerHTML = " You're not authorized";
  //   // document.getElementById('authMessage1').innerHTML = 'ypu'
  // }
});

function clearPINInputs() {
  try {
    pinInputs.forEach((input) => {
      console.log("Clearing input:", input.value);
      input.value = "";
    });
    pinInputs[0].focus();
    console.log("Inputs cleared.");
  } catch (error) {
    console.error("An error occurred while clearing inputs:", error);
  }
}

function updateCorrectPIN(value) {
  if (pinInputs.length >= 0) {
    console.log(correctPIN);
    console.log("value", value);
    if (correctPIN.length < pinInputs.length) {
      correctPIN.push(value);
    }
  }
}

// Add event listeners to each pin input to update the correctPIN array
pinInputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    const value = input.value.trim();
    if (value.length === 1 && !isNaN(value)) {
      updateCorrectPIN(value);
    }
  });
});

async function sendMessageOnSave() {
  let workcenterCheckboxes = document.querySelectorAll(
    'input[name="workcenter"]:checked'
  );
  let workcenterValues = [];

  workcenterCheckboxes.forEach((checkbox) => {
    workcenterValues.push(checkbox.value);
  });

  // Fetch the value of the element with the ID "percentRate"
  const PercentRateField = document.getElementById("percentRate");
  const fallbackField = document.getElementById("fallBack");

  const workcenterValuesString = workcenterValues.join(", ");

  var callAPICheck;

  await chrome.storage.local.get(["controlPanelCheck"]).then(async (result) => {
    console.log("controlPanelCheck =>", result.controlPanelCheck);
    // let checkBox = document.getElementById("myCheckbox");
    if (result.controlPanelCheck !== undefined) {
      callAPICheck = result.controlPanelCheck;
      // const pinDiv = document.querySelector(".pin-div");
      // pinDiv.style.display = "none";
    } else {
      callAPICheck = true;
    }
  });

  let msgObj = {
    percentRate: PercentRateField.value,
    letiable2: workcenterValuesString,
    fallbacksec: fallbackField.value,
    callAPICheck: callAPICheck,
  };

  console.log("msgObj =>", msgObj);

  // Send the message to the content script in each tab
  chrome.tabs.query(
    { url: ["*://cloud.plex.com/*", "*://test.cloud.plex.com/*"] },
    (tabs) => {
      tabs.forEach((tab) => {
        console.log("tab =>", tab, msgObj);
        chrome.tabs.sendMessage(tab.id, {
          message: "recordProduction",
          data: msgObj,
        });
      });
    }
  );
}

// Call the function when the popup is opened or when you want to send the message.
// sendMessageOnSave();

// Observe changes in the DOM for the "Save" button HTML
const saveButtonObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (
      mutation.type === "childList" &&
      mutation.target.textContent.trim() === "Saved"
    ) {
      // The "Saved" text has appeared, trigger the message sending
      sendMessageOnSave();
    }
  });
});

// Start observing the "Save" button element
const saveButton = document.getElementById("save_btn");
if (saveButton) {
  saveButtonObserver.observe(saveButton, { childList: true, subtree: true });
}

// popup.js

// popup.js

// Function to send a message to the content script
function sendMessageToContentScript(action, checked) {
  chrome.tabs.query(
    { url: ["*://cloud.plex.com/*", "*://test.cloud.plex.com/*"] },
    function (tabs) {
      tabs.forEach((tab) => {
        console.log("activetab", tab);
        const activeTab = tab;
        chrome.tabs.sendMessage(activeTab.id, { action, checked });
      });
    }
  );
}

// Add an event listener to the "heirarchy view" checkbox
const hierarchyCheckbox = document.getElementById("hieracyView");

// Function to save the checkbox state to Chrome storage
function saveCheckboxState(isChecked) {
  chrome.storage.local.set({ hieracyView: isChecked }, function () {
    console.log(`Checkbox state saved: ${isChecked}`);
  });
}

// Function to set the checkbox state based on the stored value
function setCheckboxState() {
  chrome.storage.local.get(["hieracyView"], function (result) {
    const isChecked = result.hieracyView;
    if (isChecked) {
      hierarchyCheckbox.checked = true;
      // Send a message to the content script if needed
      sendMessageToContentScript("rotatePlusIcon", isChecked);
    } else {
      hierarchyCheckbox.checked = false;
    }
  });
}

// Add an event listener to the checkbox
if (hierarchyCheckbox) {
  hierarchyCheckbox.addEventListener("change", function () {
    const isChecked = this.checked;
    // Save the checkbox state to Chrome storage
    saveCheckboxState(isChecked);
    // Send a message to the content script with the action and checked status if needed
    sendMessageToContentScript("rotatePlusIcon", isChecked);
    console.log(`Checkbox checked: ${isChecked}`);
  });

  // Set the checkbox state when the popup is opened
  setCheckboxState();
}

document.addEventListener("DOMContentLoaded", function () {
  function getValuesFromStorage(callback) {
    chrome.storage.local.get(["Values"], function (result) {
      if (chrome.runtime.lastError) {
        console.error("Error getting values:", chrome.runtime.lastError);
        callback(null);
      } else {
        let retrievedValues = result.Values;
        callback(retrievedValues);
      }
    });
  }

  getValuesFromStorage(function (retrievedValues) {
    if (retrievedValues) {
      console.log("retrievedValues", retrievedValues);
      let percentRate = retrievedValues.PercentRate;
      let Workcenter = retrievedValues.Workcentre;
      let fallBack = retrievedValues.Fallback;

      let percentRateInput = document.getElementById("percentRate");
      let fallbackInput = document.getElementById("fallBack");

      if (percentRateInput) {
        percentRateInput.value = percentRate || "";
      }

      if (fallbackInput) {
        fallbackInput.value = fallBack || "";
      }

      // Set radio button state (assuming Workcenter is an array of selected values)
      let radioButtons = document.querySelectorAll('input[name="workcenter"]');
      radioButtons.forEach(function (radioButton) {
        if (Workcenter.includes(radioButton.value)) {
          radioButton.checked = true;
        } else {
          radioButton.checked = false;
        }
      });

      console.log("Retrieved PercentRate:", percentRate);
      console.log("Retrieved Workcenter:", Workcenter);
      console.log("Retrieved Fallback:", fallBack);
    } else {
      // Handle the case where the values couldn't be retrieved
      console.log("Values not found in storage");
    }
  });
});

const getPcnName = async () => {
  const data = await chrome.storage.local.get(["pcnName"]);
  console.log("pcnName", data.pcnName);
  return data.pcnName;
};
