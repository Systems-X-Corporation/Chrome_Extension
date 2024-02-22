console.log("Content script loaded ali");
let baseURL;

chrome.storage.local.get(["baseURL"], function (result) {
  console.log("URL =>", result.baseURL);
  baseURL = result.baseURL;
});

let productionType = window.location.href.includes("test.cloud.plex.com")
  ? "test"
  : window.location.href.includes("cloud.plex.com")
  ? "prod"
  : "";
console.log("productionType =>", productionType);

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

// Test
let wrapperElement;
let ulElement;
let pixcelSearchResult = document.querySelectorAll(".plex-actions");
let wrapperSearchResult = document.querySelector(
  '.plex-actions-wrapper[data-bind*="autoID"]'
);
console.log("wrapperSearchResult =>", wrapperSearchResult);

// var secondElement = document.querySelector('.plex-actions-wrapper[data-bind*="autoID"]');
// console.log("Second element:", secondElement);

// pixcelSearchResult = [pixcelSearchResult[0]]

pixcelSearchResult.forEach((element) => {
  if (element.id.includes("autoID")) {
    console.log("pixcelSearchResult =>", element);
    ulElement = element;
  }
});

// wrapperSearchResult.forEach((element) => {
//   if (element.id.includes("autoID")) {
//     console.log("pixcelSearchResult =>", element);
//     ulElement = element;
//   }
// });
var firstLi;
var secondLi;

function closeButton() {
  document
    .getElementById("system-x-close")
    .addEventListener("click", function () {
      // Your code to handle the click event goes here
      console.log("System close button clicked!");
      console.log("step-1");
      popuptimer.style.display = "none";

      var elementData = document.getElementById("record_button");

      console.log("test element =>", elementData);
      if (firstLi) {
        console.log("test element =>", firstLi);
        firstLi.style.display = "none";
      } else {
        console.error("Element not found with the provided XPath.");
      }

      if (secondLi) {
        secondLi.style.display = "inline-block";
        elementData.style.display = "flex";
      } else {
        console.error("Element not found with the provided XPath.");
      }
    });
}

function observeElementAppended(element, callback) {
  console.log("observeElementAppended =>", element);
  const targetNode = element;

  const mutationCallback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        // Execute the provided callback when the element is added
        callback(targetNode);
        // Don't forget to disconnect the observer if needed
        observer.disconnect();
      }
    }
  };

  const observer = new MutationObserver(mutationCallback);
  const config = { childList: true };

  if (targetNode) {
    observer.observe(targetNode, config);
  }

  // Clean up the observer when you're done
  return () => {
    if (targetNode) {
      observer.disconnect();
    }
  };
}

// observeElementAppended(ulElement, (selectedElement) => {
console.log("Element found:", ulElement);
if (ulElement) {
  if (document.URL.includes("Production?")) {
    // Create a new li element with specific content
    const newLi = document.createElement("li");
    newLi.style.marginLeft = "5px";
    // newLi.style.display = "none";
    newLi.className = "disabled";
    newLi.setAttribute(
      "data-bind",
      "title: $data.title, click: $data.executeAction, css: { 'disabled': !$data.isEnabled() }, visible: $data.visible()"
    );
    newLi.innerHTML = `<a class="record-production-actionbar-button disabled" data-bind="id: $data.id, href: $data.href, css: {'disabled': !$data.isEnabled() }" id="" href="">
              <i class="plex-actionbar-icon record-production-action-icon plex-icon-cp-record-production" data-bind="css: $data.iconClass"></i>
              <span class="record-production-action-title" data-bind="text: $data.text">Record Production</span>
            </a>`;

    console.log("children =>", ulElement);
    // Check if there is at least one child
    if (ulElement.children.length >= 1) {
      // Insert the new li element as the second child
      ulElement.insertBefore(newLi, ulElement.children[1]);
      firstLi = ulElement.querySelector(".plex-actions li:nth-child(1)");
      ulElement.querySelector(".plex-actions li:nth-child(1)").style.display =
        "none";
      secondLi = ulElement.querySelector(".plex-actions li:nth-child(2)");
    } else {
      // If there are no children, simply append the new li element
      ulElement.appendChild(newLi);
      firstLi = ulElement.querySelector(".plex-actions li:nth-child(1)");
      secondLi = ulElement.querySelector(".plex-actions li:nth-child(2)");
    }
  }
} else {
  console.error("Element not found with the provided XPath.");
}
// });

// waitForElement(
//   "/html/body/div[3]/div[2]/div[4]/div[1]/ul",
//   (selectedElement) => {
//     console.log("Element found:", selectedElement);
//     if (selectedElement) {
//       // Create a new li element with specific content
//       const newLi = document.createElement("li");
//       newLi.style.marginLeft = "5px";
//       newLi.style.display = "none";
//       newLi.className = "disabled";
//       newLi.setAttribute(
//         "data-bind",
//         "title: $data.title, click: $data.executeAction, css: { 'disabled': !$data.isEnabled() }, visible: $data.visible()"
//       );
//       newLi.innerHTML = `
//           <a class="record-production-actionbar-button disabled" data-bind="id: $data.id, href: $data.href, css: {'disabled': !$data.isEnabled() }" id="" href="">
//             <i class="plex-actionbar-icon record-production-action-icon plex-icon-cp-record-production" data-bind="css: $data.iconClass"></i>
//             <span class="record-production-action-title" data-bind="text: $data.text">Record Production</span>
//           </a>
//         `;

//       // Check if there is at least one child
//       if (selectedElement.children.length >= 1) {
//         // Insert the new li element as the second child
//         selectedElement.insertBefore(newLi, selectedElement.children[1]);
//       } else {
//         // If there are no children, simply append the new li element
//         selectedElement.appendChild(newLi);
//       }
//     } else {
//       console.error("Element not found with the provided XPath.");
//     }
//   }
// );
// const xpath = "/html/body/div[3]/div[2]/div[4]/div[1]/ul";
// const result = document.evaluate(
//   xpath,
//   document,
//   null,
//   XPathResult.FIRST_ORDERED_NODE_TYPE,
//   null
// );

// // console.log("result test =>", result);
// const selectedElement = result.singleNodeValue;

// if (selectedElement) {
//   // Create a new li element with specific content
//   const newLi = document.createElement("li");
//   newLi.style.marginLeft = "5px";
//   newLi.className = "system-x-record-button disabled";
//   newLi.setAttribute(
//     "data-bind",
//     "title: $data.title, click: $data.executeAction, css: { 'disabled': !$data.isEnabled() }, visible: $data.visible()"
//   );
//   newLi.innerHTML = `
//       <a class="record-production-actionbar-button disabled" data-bind="id: $data.id, href: $data.href, css: {'disabled': !$data.isEnabled() }" id="" href="">
//         <i class="plex-actionbar-icon record-production-action-icon plex-icon-cp-record-production" data-bind="css: $data.iconClass"></i>
//         <span class="record-production-action-title" data-bind="text: $data.text">Record Production</span>
//       </a>
//     `;

//   // Check if there is at least one child
//   if (selectedElement.children.length >= 1) {
//     // Insert the new li element as the second child
//     selectedElement.insertBefore(newLi, selectedElement.children[1]);
//   } else {
//     // If there are no children, simply append the new li element
//     selectedElement.appendChild(newLi);
//   }
// } else {
//   console.error("Element not found with the provided XPath.");
// }

// main
const input_Field = document.getElementsByClassName("plex-numeric-text");
let inputValue;
const field_name = document.querySelectorAll(".plex-control-label div label");
let percentRate = localStorage.getItem("percentRate");
let variable2 = localStorage.getItem("variable2");
let fallbacksec = localStorage.getItem("fallbacksec");
const widgetHeaderData = document.querySelector(".widget-header-1").textContent;
console.log("Data from widget-header-1:", widgetHeaderData);
console.log("field_name", field_name);
if (field_name[2]?.textContent === "Quantity per Container") {
  console.log("field_name[2]", field_name[2]);
  console.log("hellofield_name[2].textContent", field_name[2].textContent);
  if (input_Field[1].value.length !== 0) {
    inputValue = input_Field[1].value;
  }
  input_Field[1].addEventListener("change", function () {
    console.log("Quantity per Container change =>");
    // This function will be called when the input value changes
    if (input_Field[1].value.length !== 0) {
      inputValue = input_Field[1].value;
      console.log("inputValue", inputValue);
    } else {
      inputValue = 0;
    }
    console.log("Extracted Value:", inputValue);
  });
}
if (field_name[1]?.textContent === "Quantity per Container") {
  console.log(
    "field_name[1]",
    field_name[1].parentNode.parentNode.parentElement.children[1].children[0]
      .value
  );
  console.log("hellofield_name[1].textContent", field_name[1].textContent);
  let el =
    field_name[1].parentNode.parentNode.parentElement.children[1].children[0];
  console.log("el ==>", el);
  console.log("el.value ==>", el.value);
  el.addEventListener("change", function () {
    console.log("Quantity per Container change =>");
    console.log("el.value ==>", el.value);
    // This function will be called when the input value changes
    if (el.value.length !== 0) {
      inputValue = el.value;
      console.log("inputValue", inputValue);
    } else {
      inputValue = 0;
    }
    console.log("Extracted Value:", inputValue);
  });
}
if (field_name[1]?.textContent == "Production") {
  if (input_Field[0].value.length !== 0) {
    inputValue = input_Field[0].value;
  }
  input_Field[0].addEventListener("change", function () {
    console.log("Production change =>");
    // This function will be called when the input value changes
    if (input_Field[0].value.length !== 0) {
      inputValue = input_Field[0].value;
    } else {
      inputValue = 0;
    }
    console.log("Extracted Value:", inputValue);
  });
}
const callAPI = localStorage.getItem("callAPI");
console.log("callAPI =>", callAPI);
if (document.URL.includes("Production?")) {
  if (callAPI === "true" && callAPI !== undefined) {
    let tableandrowelement = document.createElement("div");
    tableandrowelement.setAttribute("id", "record_button");
    tableandrowelement.style.top = "-42px";
    tableandrowelement.style.left = "3px";
    tableandrowelement.style.position = "relative";
    tableandrowelement.style.width = "211px";
    // tableandrowelement.innerHTML = `<a style="padding: 6px 10px;" class=" ${localStorage.getItem("recordProductionButtonDisabled")? "button_new": "record-production-actionbar-button"}"><i class="plex-actionbar-icon record-production-action-icon plex-icon-cp-record-production" data-bind="css: $data.iconClass"></i><span class="record-production-action-title" data-bind="text: $data.text">${localStorage.getItem("recordProductionButtonDisabled")? "Plex Disabled": "Record Production" }</span></a>`;
    tableandrowelement.innerHTML = `
  <button style="padding: 4px 10px; display: flex;
  color: white;     width: 215px !important;
  " class=" button_new record-production-actionbar-button" disable>
<i class="plex-actionbar-icon record-production-action-icon plex-icon-cp-record-production" data-bind="css: $data.iconClass"></i>
<span class="" data-bind="text: $data.text">Record Production</span>
</button>`;

    ulElement.insertAdjacentElement("afterend", tableandrowelement);

    // ulElement.append(tableandrowelement);
    tableandrowelement.addEventListener("click", async function () {
      const urlParams = new URLSearchParams(window.location.search);
      const myParam = urlParams.get("WorkcenterKey");
      const data = await chrome.storage.local.get(["pcnName"]);
      console.log("pcnName", data.pcnName);
      const pcnName = data.pcnName;

      if (field_name[2].textContent === "Quantity per Container") {
        console.log("test-1 =>", input_Field[1].value);
        if (input_Field[1].value.length !== 0) {
          inputValue = input_Field[1].value;
        } else {
          inputValue = 0;
        }
      }
      if (field_name[1].textContent === "Production") {
        console.log("test-2 =>", input_Field[0].value);
        if (input_Field[0].value.length !== 0) {
          inputValue = input_Field[0].value;
        } else {
          inputValue = 0;
        }
      }

      // Create the data to send in the POST request
      var dataToSend = {
        workcenter_no: widgetHeaderData,
        production_type: productionType,
        percent_of_rate: percentRate,
        workcenter_rate: variable2,
        Workcenter_Key: myParam,
        pcnName: pcnName,
      };

      inputValue !== 0 ? (dataToSend.pcs = inputValue) : "";
      localStorage.getItem("fallbacksec") !== ""
        ? (dataToSend.fall_back_sec = localStorage.getItem("fallbacksec"))
        : "";

      console.log("Data to send in the POST request:", dataToSend);

      const callAPI = localStorage.getItem("callAPI");

      console.log("result.callAPI =>", callAPI === "true");
      // if (localStorage.getItem("recordProductionButtonDisabled") === false) {
      if (
        callAPI !== undefined &&
        callAPI === "true"
        // && !localStorage.getItem("fallbacksec")
      ) {
        console.log("hello");
        // recordProductionButton.click();
        console.log("firstLi.style.display =>", firstLi);
        fetch(`${baseURL}/cooldown`, {
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
            if (ApiResponse.error === "No data found!") {
              document.getElementById("popupHeadHeading").innerText =
                "Webservice API data not available! Please try later.";
              document.getElementById("system-x-close").innerText =
                "Close Popup";
              document.getElementById("system-x-min").style.display = "none";
              document.getElementById("againProd").style.display = "none";
              let popuptimer = document.getElementById("popup_timer");
              document.getElementById("total_cooldown_no").innerText = "N/A";
              document.getElementById("adjusted_cooldown").innerText = "N/A";
              popuptimer.style.display = "flex";
              setTimer("No data!");
              return;
            }
            if (ApiResponse.error === "Workcenter data is not avalable") {
              document.getElementById("popupHeadHeading").innerText =
                "Workcenter data not found! Contact support.";
              document.getElementById("system-x-close").innerText =
                "Close Popup";
              document.getElementById("system-x-min").style.display = "none";
              document.getElementById("againProd").style.display = "none";
              let popuptimer = document.getElementById("popup_timer");
              document.getElementById("total_cooldown_no").innerText = "N/A";
              document.getElementById("adjusted_cooldown").innerText = "N/A";
              popuptimer.style.display = "flex";
              setTimer("No data!");
              return;
            }
            let cooldown_no = ApiResponse.cooldown_no;
            let total_cooldown_no = ApiResponse.total_cooldown_no;
            document.getElementById("total_cooldown_no").innerText =
              Math.ceil(total_cooldown_no) + "s";
            document.getElementById("adjusted_cooldown").innerText =
              Math.ceil(cooldown_no) + "s";
            // console.log("cooldown_no", cooldown_no);
            // console.log("cooldown_no", Math.ceil(cooldown_no));
            // console.log("API Response Status:", response.status);
            // console.log("API Response:", response);
            var elementData = document.getElementById("record_button");

            // var firstLi = ulElement.querySelector(
            //   ".plex-actions li:nth-child(1)"
            // );
            // var secondLi = ulElement.querySelector(
            //   ".plex-actions li:nth-child(2)"
            // );

            if (response.status == 200) {
              let popuptimer = document.getElementById("popup_timer");

              if (firstLi) {
                console.log("test element =>", firstLi);
                firstLi.style.display = "none";
              } else {
                console.error("Element not found with the provided XPath.");
              }

              if (secondLi) {
                secondLi.style.display = "inline-block";
                elementData.style.display = "none";
              } else {
                console.error("Element not found with the provided XPath.");
              }

              console.log("response test =>", ApiResponse);
              if (cooldown_no > 0) {
                popuptimer.style.display = "flex";
                const time = Math.ceil(cooldown_no);
                setTimer(time);
              } else {
                console.log("firstLi.style.display =>");
                firstLi.style.display = "inline-block";
                firstLi.click();
                setTimeout(() => {
                  // popuptimer.style.display = "none";

                  if (firstLi) {
                    console.log("test element =>", firstLi);
                    firstLi.style.display = "none";
                  } else {
                    console.error("Element not found with the provided XPath.");
                  }

                  if (secondLi) {
                    secondLi.style.display = "inline-block";
                    elementData.style.display = "flex";
                  } else {
                    console.error("Element not found with the provided XPath.");
                  }
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
  } else {
    firstLi.style.display = "inline-block";
    secondLi.style.display = "none";
  }
}

function getGreeting() {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good morning user!";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good afternoon user!";
  } else {
    return "Good evening user!";
  }
}

const greeting = getGreeting();

let popuptimer = document.createElement("div");
popuptimer.setAttribute("id", "popup_timer");
popuptimer.style.position = "absolute";
popuptimer.style.borderRadius = "10px";
// popuptimer.style.marginTop = "45px";
popuptimer.style.width = "30vw";
popuptimer.style.height = "20vh";
popuptimer.style.backgroundColor = "whitesmoke !important";
popuptimer.style.color = "white";
popuptimer.style.textAlign = "center";
popuptimer.style.justifyItems = "center";
popuptimer.style.alignItems = "center";
popuptimer.style.display = "none";
popuptimer.style.zIndex = "1";
popuptimer.style.justifyContent = "center";
// popuptimer.style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px"
popuptimer.style.top = "50%";
popuptimer.style.left = "50%";
// popuptimer.style.right = "50%";
// popuptimer.style.transition = "0.1s ease-in-out"

popuptimer.innerHTML = `
<div style="width: 100%;
margin-top: 45px;
     border-radius: 5px;
background-color: whitesmoke !important;     box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px;
border-radius: 5px;
background-color: whitesmoke !important;">
<div
style="
  transition: 0.5s ease-in-out;

"
>
<div
  style="
    opacity: 1;
    text-align: center;
    border-radius: 5px;
    background-image: -webkit-linear-gradient(
      117deg,
      #f15757 50%,
      #e74d4f 50%
    );
    font-size: 20px;
    font-weight: 600;
    width: 100%;
    padding: 30px 0px;
  "
>
  <img src="${chrome.runtime.getURL(
    "images/warning.png"
  )}" width="90px" alt="" />
  <h1 style="margin: 2px">WARNING!</h1>
  <div id="popupHeadHeading">You are not allowed to record production at this time</div>
  <div>Total Cooldown: <span id="total_cooldown_no">500s</span></div>
  <div>Adjusted Cooldown: <span id="adjusted_cooldown">486s</span></div>
  <div id="againProd">
    Time to record production again:
    <span id="countdown">373s </span>
  </div>
</div>
<div
  style="
    display: flex;
    justify-content: space-evenly;
    padding: 20px 0px;
  "
>
  <button
    id="system-x-min"
    style="
      border-radius: 10px;
      background-color: #e74d4f;
      color: white;
      border: none;
      cursor: pointer;
      padding: 10px 20px;
    "
  >
    Continue Waiting
  </button>
  <button
    id="system-x-close"
    style="
      border-radius: 10px;
      background-color: gainsboro;
      color: white;
      padding: 5px 10px;
      border: none;
      cursor: pointer;
      padding: 10px 20px;
    "
  >
    Update Production
  </button>
</div>
</div>
<div
style="
display: none;
  transition: 0.5s ease-in-out;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  background-color: whitesmoke !important;
"
>
<div
  style="
    opacity: 1;
    text-align: center;
    border-radius: 5px;
    background-image: -webkit-linear-gradient(
      117deg,
      #f15757 50%,
      #e74d4f 50%
    );
    font-size: 20px;
    font-weight: 600;
    width: 100%;
    padding: 30px 0px;
  "
>
  <div>
    <span id="countdown2">373s </span>
  </div>
</div>
<div
  style="
    display: flex;
    justify-content: space-evenly;
    padding: 10px 0px;
  "
>
  <button
    id="system-x-max"
    style="
      border-radius: 10px;
      background-color: #e74d4f;
      color: white;
      border: none;
      cursor: pointer;
      padding: 10px 20px;
    "
  >
    Maximize
  </button>
</div>
</div>
</div>

`;
let popup_div = document.querySelector("#autoID1_persistentBanner");
popup_div.prepend(popuptimer);
closeButton();

// Add event listener to the "Continue Waiting" button
document.getElementById("system-x-min").addEventListener("click", function () {
  const data = document.querySelectorAll("#popup_timer > div > div");
  console.log("data test =>", data);
  // // Hide unnecessary elements
  document.querySelector("#popup_timer").style.width = "8vw";
  document.querySelector("#popup_timer").style.height = "8vh";
  data[0].style.display = "none";
  data[1].style.display = "unset";
});

document.getElementById("system-x-max").addEventListener("click", function () {
  const data = document.querySelectorAll("#popup_timer > div > div");
  console.log("data test =>", data);
  // // Hide unnecessary elements
  document.querySelector("#popup_timer").style.width = "30vw";
  document.querySelector("#popup_timer").style.height = "20vw";
  data[0].style.display = "unset";
  data[1].style.display = "none";
});

let isDragging = false;
let offsetX, offsetY;

popuptimer.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - popuptimer.getBoundingClientRect().left;
  offsetY = e.clientY - popuptimer.getBoundingClientRect().top;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    // Check boundaries
    const maxX = window.innerWidth - popuptimer.offsetWidth;
    const maxY = window.innerHeight - popuptimer.offsetHeight - 45;

    // Ensure the element stays within the screen boundaries
    popuptimer.style.left = `${Math.min(Math.max(0, x), maxX)}px`;
    popuptimer.style.top = `${Math.min(Math.max(0, y), maxY)}px`;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

var currentInterval;

function setTimer(time) {
  // Clear the previous interval if it exists
  if (time === "No data!") {
    return;
  } else {
    document.getElementById("popupHeadHeading").innerText =
      "You are not allowed to record production at this time";
    document.getElementById("againProd").style.display = "block";
    document.getElementById("system-x-close").innerText = "Update Production";
    document.getElementById("system-x-min").style.display = "block";
    if (currentInterval) {
      clearInterval(currentInterval);
    }

    var x = setInterval(function () {
      document.getElementById("countdown").innerHTML = time + "s ";
      document.getElementById("countdown2").innerHTML = time + "s ";
      time--;
      if (time < 0) {
        if (popuptimer) {
          popuptimer.style.display = "none";
          console.log("step-1");

          // var firstLi = ulElement.querySelector(".plex-actions li:nth-child(1)");
          // var secondLi = ulElement.querySelector(".plex-actions li:nth-child(2)");
          var elementData = document.getElementById("record_button");

          console.log("test element =>", elementData);
          if (firstLi) {
            firstLi.style.display = "inline-block";
          } else {
            console.error("Element not found with the provided XPath.");
          }

          if (secondLi) {
            secondLi.style.display = "none";
            elementData.style.display = "flex";
          } else {
            console.error("Element not found with the provided XPath.");
          }
        }
        clearInterval(x);
      }
    }, 1000);

    // Set the current interval to the new interval
    currentInterval = x;
  }
}

// function setTimer(time) {
//   var x = setInterval(function () {
//     document.getElementById("countdown").innerHTML = time + "s ";
//     time--;
//     if (time < 0) {
//       if (popuptimer) {
//         popuptimer.style.display = "none";
//         console.log("step-1");

//         const result = document.evaluate(
//           "/html/body/div[3]/div[2]/div[4]/div[1]/ul/li[1]",
//           document,
//           null,
//           XPathResult.FIRST_ORDERED_NODE_TYPE,
//           null
//         );

//         const selectedElement = result.singleNodeValue;

//         if (selectedElement) {
//           selectedElement.style.display = "inline-block";
//         } else {
//           console.error("Element not found with the provided XPath.");
//         }

//         const result2 = document.evaluate(
//           "/html/body/div[3]/div[2]/div[4]/div[1]/ul/li[2]",
//           document,
//           null,
//           XPathResult.FIRST_ORDERED_NODE_TYPE,
//           null
//         );

//         const selectedElement2 = result2.singleNodeValue;
//         var elementData = document.getElementById("record_button");

//         if (selectedElement2) {
//           selectedElement2.style.display = "none";
//           elementData.style.display = "flex";
//         } else {
//           console.error("Element not found with the provided XPath.");
//         }
//       }
//       clearInterval(x);
//     }
//   }, 1000);
// }

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
    firstLi.style.display = "inline-block";
    secondLi.style.display = "none";
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
