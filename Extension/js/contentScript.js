// console.log("hello World");
let data = [];
let hierarchyArr = [];
let pcnarr;
let authToken;
let pcnEmail;
let pcnPassword;

// For loop for finding the PCN number from frontend
let scripts = document.getElementsByTagName("script");
for (let i = 0; i < scripts.length; i++) {
  const script = scripts[i];
  if (script.innerHTML.includes("plex.appState")) {
    pcnarr = script.innerHTML;
    break;
  }
}
let pcn;
try {
  console.log("pcnarr", pcnarr);
  let pcnarrNew = pcnarr.split("'")[1];
  console.log("pcnarr", pcnarr);
  pcnarrNew = pcnarr.split("'")[0];
  console.log("pcnarr", pcnarr);
  pcnarrNew = pcnarr.split(/\\/).join("");
  console.log("pcnarr", pcnarr);
  pcnarrNew = JSON.parse(pcnarr);
  console.log("pcnarr", pcnarr);
  pcn = pcnarr.customer.pcn;
} catch (error) {
  console.log("error", error);

  let startIndex = pcnarr.indexOf("plex.appState = plex.parsing.parseJSON(");

  console.log("startIndex", startIndex);
  if (startIndex !== -1) {
    // Find the index of the first ' after the start index
    let firstSingleQuoteIndex = pcnarr.indexOf("'", startIndex);
    let secondSingleQuoteIndex;
    if (firstSingleQuoteIndex !== -1) {
      // Find the index of the second ' after the first '
      secondSingleQuoteIndex = pcnarr.indexOf("'", firstSingleQuoteIndex + 1);

      if (secondSingleQuoteIndex !== -1) {
        console.log(
          "Index of the first ' after the specified string:",
          firstSingleQuoteIndex
        );
        console.log(
          "Index of the second ' after the specified string:",
          secondSingleQuoteIndex
        );
      } else {
        console.log(
          "Second single quote not found after the specified string."
        );
      }
    } else {
      console.log("First single quote not found after the specified string.");
    }
    let extractedString = pcnarr.substring(
      firstSingleQuoteIndex + 1,
      secondSingleQuoteIndex
    );
    try {
      console.log(extractedString);
      // let pcnarrNew = JSON.parse(extractedString);
      // Decode escape characters in the string
      let decodedString = extractedString.replace(/\\(.)/g, "$1");
      console.log("decodedString ==>", decodedString);
      // Parse the string to an object
      let pcnarrNew = JSON.parse(decodedString);
      console.log("pcnarrNew", pcnarrNew);
      pcn = pcnarrNew.customer.pcn;
      // const pcn = pcnNumber;
      console.log("pcn", pcn);
    } catch (error) {
      console.log("error", error);
    }
  } else {
    console.log("Specified string not found in the input.");
  }
}
// Regular expression to match "pcn": followed by a number
// console.log("pcnarr", pcnarr);
// const regex = /"mainPCN":(\d+),/;
// // Executing the regular expression on the input string
// const match = regex.exec(pcnarr);
// console.log("match", match);
// // Extracting the number if a match is found
// let pcnNumber = null;
// if (match && match.length > 1) {
//   pcnNumber = parseInt(match[1]);
// }

// console.log("PCN Number:", pcnNumber);

// const pcn = pcnNumber;
console.log("pcn", pcn);
// if (!pcn) {}
// Adding the PCN number to the local storage
chrome.storage.local.set({ pcn: pcn }).then(() => {});

// getting pcnname
// Using document.evaluate to select the element by XPath
setTimeout(() => {
  const xpathExpression = '//*[@id="navBar"]/div/div[2]/a';
  const result = document.evaluate(
    xpathExpression,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  console.log("result ", result);
  // Check if the element is found
  if (result.singleNodeValue) {
    // Access the inner text of the element
    const innerText = result.singleNodeValue.innerText;

    // Log the inner text to the console
    console.log("Inner Text:", innerText);
    chrome.storage.local.set({ pcnName: innerText }).then(() => {});
  } else {
    console.error("Element not found with the specified XPath.");
  }
}, 2000);

// Function for Calling Api

async function requestingDataApi() {
  // If we open the https://cloud.plex.com then this if condition api called
  if (document.location.href.includes("https://cloud.plex.com/")) {
    await fetch(`${baseURL}/get-Ws`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        {
          data.recordset &&
            data.recordset.map((item) => {
              if (item.Plexus_Customer_No === pcn) {
                pcnEmail = item.Email;
                pcnPassword = item.Password;
              }
            });
        }

        // Handle the response from the server
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const encodedCredentials = btoa(`${pcnEmail}:${pcnPassword}`);
    var settings = {
      url: `https://cloud.plex.com/api/datasources/234347/execute?Content-Type=application/json;charset=utf-8&Accept=application/json&Accept-Encoding=gzio,deflate`,
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json",
      },
      // Requesting for Description_With_Hierarchy data with api
      data: JSON.stringify({
        inputs: {
          Description_With_Hierarchy: "",
        },
      }),
    };

    $.ajax(settings).done(async function (response) {
      // Response from the api will stored in data array
      data = response;
      console.log("DATA==>>", data);
      await treeviwrecall();
      // console.log(response);
    });
    $.ajax(settings).fail(function (error) {
      // Response from the api will stored in data array
      console.error("ERROR", error);
      // console.log(response);
    });
  }
  // If we open the https://test.cloud.plex.com then this if condition api called
  if (document.location.href.includes("https://test.cloud.plex.com/")) {
    await fetch(`${baseURL}/get-Ws`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        {
          data.recordset &&
            data.recordset.map((item) => {
              if (item.Plexus_Customer_No === pcn) {
                pcnEmail = item.Email;
                pcnPassword = item.Password;
              }
            });
        }

        // Handle the response from the server
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const encodedCredentials = btoa(`${pcnEmail}:${pcnPassword}`);
    var settings = {
      url: "https://test.cloud.plex.com/api/datasources/234347/execute?Content-Type=application/json;charset=utf-8&Accept=application/json&Accept-Encoding=gzio,deflate",
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json",
      },
      // Requesting for Description_With_Hierarchy data with api
      data: JSON.stringify({
        inputs: {
          Description_With_Hierarchy: "",
        },
      }),
    };

    $.ajax(settings).done(function (response) {
      // Response from the api will stored in data array

      data = response;

      treeviwrecall();
      // console.log(response);
    });
  }
}

// Function Waiting for the Elements
function waitForElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

// Function for Getting Current tab url
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

// Function for equipemnt id on click
function AuthSuccess() {
  // Query Selector for Equipment btn
  document
    .querySelector(".plex-element-list .plex-picker-control .plex-picker-icon")
    .addEventListener("click", function () {
      // Condition for Tree view checkbox
      chrome.storage.local.get(["ShowTree"]).then((result) => {
        let showtreeview = result.ShowTree;
        console.log("result", showtreeview);
        if (showtreeview === true) {
          // Condition for Tree Token Value
          chrome.storage.local.get(["TokenValue"]).then((result) => {
            let Token = result.TokenValue;

            if (Token) {
              findingPickerSearchResult();
              // Checking the api data
              if (data.length != 0) {
                createTreeviweData();
              }

              //  If Api Data length is zero then this condition work
              if (data.length == 0) {
                apirecallingFn();
                console.log("search btn Clicked api request");
              }
              // tabledataExtractor()
            }
          });
        }
      });
    });
}

// Function For Calling fFunction's Again if api response is late or empty
async function apirecallingFn() {
  console.log("apirecallingFn called");
  if (data == 0) {
    // Calling the API Request function
    await requestingDataApi();
  }
}

// Function for setting up the api data in tree view
async function treeviwrecall() {
  console.log("ENTER IN TREEVIew");
  // Waiting for the element
  await waitForElement(".rowdataviewcontainer");

  // if (document.querySelector(".rowdataviewcontainer").innerHTML == '') {
  // console.log("inside if recallingFn");
  await createTreeviweData();
  // }
}

// Function For Adding Button On Live Page
async function findingPickerSearchResult() {
  // Waiting for the element
  await waitForElement(".plex-picker-search-results");

  // Creating the radio button for toggling tree and table view
  let pixcelSearchResult = document.querySelector(
    ".plex-picker-search-results"
  );
  let pixcelSearchSection = document.querySelector(
    ".plex-picker-search-section"
  );
  let tableandrowelement = document.createElement("div");
  tableandrowelement.setAttribute("id", "Table_And_Row_Switch_Section");
  // Show table is by default checked
  tableandrowelement.innerHTML = `
            <input type="radio" id="Table_And_Row_Radio_Btn" name="Row_and_Tree_view" value="Show_table" checked="checked">
            <label for= "html" >Show table</label >
            <input type="radio" id="Table_And_Row_Radio_Btn" name="Row_and_Tree_view" value="Show_tree">
            <label for="css">Show tree</label>
            `;
  pixcelSearchResult.prepend(tableandrowelement);

  // Creating div for the tree view
  let rowdataviewcontainer = document.createElement("div");
  rowdataviewcontainer.classList.add("rowdataviewcontainer");
  rowdataviewcontainer.classList.add("display-none");
  pixcelSearchResult.append(rowdataviewcontainer);

  // for loop for radio btn functionality
  let radioBtnRowTable = document.querySelectorAll("#Table_And_Row_Radio_Btn");
  for (let i = 0; i < radioBtnRowTable.length; i++) {
    // Adding eventlistner for radio btn
    radioBtnRowTable[i].addEventListener("click", function () {
      let radioBtnValue = $(
        "input[type='radio'][name='Row_and_Tree_view']:checked"
      ).val();
      // If Show table Btn value is checked
      if (radioBtnValue == "Show_table") {
        showTableView();
        // else Show tree Btn value is checked
      } else if (radioBtnValue == "Show_tree") {
        showRowView();
      }
    });
  }
}

// Function for Show table radio btn
function showTableView() {
  // Adding and Removeing display-none class to tree view and table view
  document
    .querySelector(".plex-picker-content")
    .classList.remove("display-none");
  document.querySelector(".rowdataviewcontainer").classList.add("display-none");
}

// Function for Show row btn
function showRowView() {
  // if api data is empty by any reason
  if (data.length == 0) {
    // console.log("Data is empty");
    // calling the api recall function
    apirecallingFn();
  }
  // Adding and Removeing display-none class to tree view and table view
  document.querySelector(".plex-picker-content").classList.add("display-none");
  document
    .querySelector(".rowdataviewcontainer")
    .classList.remove("display-none");
}

// Function For Seeting Up Data in Tree View
async function createTreeviweData() {
  // If lenght of data is zero then this condition called
  if (data.length == 0) {
    // Function for api recalling
    apirecallingFn();
    // If length of data is not equal to zero
  } else {
    // Function For Setting the Children in hierarchy view
    hierarchyArr = [];
    // console.log(hierarchyArr);
    function createHierarchyArr(Last_DAta, node, parent) {
      if (Last_DAta.length > 0) {
        for (let i = 0; i < Last_DAta.length; i++) {
          const item = Last_DAta[i];

          let newItem;
          if (item.children && item.children.length > 0) {
            newItem = createHierarchyArr(item.children, node, parent);
          } else if (item.id == parent) {
            item.children.push(node);
          }
          if (newItem) {
            Last_DAta[i] = newItem;
          }
        }
      } else {
        Last_DAta.push(node);
      }
      return Last_DAta;
    }
    // Loop for Setting the data in hierarchy vire
    for (let i = 0; i < data.tables[0].rows.length; i++) {
      const val = data.tables[0].rows[i][1];
      const parent = data.tables[0].rows[i][3];
      let name = data.tables[0].rows[i][11];
      let check = data.tables[0].rows[i][5];
      let node = {
        name,
        id: val,
        children: [],
      };

      // If parrent of any obejct is null
      if (parent == null) {
        // pusshing the node in hierarchyArr Array
        hierarchyArr.push(node);
      } else {
        // If parrent of any obejct is not equal to null
        for (let i = 0; i < hierarchyArr.length; i++) {
          const el = hierarchyArr[i];
          if (check.includes(el.id)) {
            // console.log(el.children);
            hierarchyArr[i].children = createHierarchyArr(
              el.children,
              node,
              parent
            );
            break;
          }
        }
      }
    }
    // Calling the function for setting up the tree view
    settingTreeview();
  }
}
console.log("....hello...");
// Function for setting Tree view from hierarchyArr Array
async function settingTreeview() {
  await waitForElement(".rowdataviewcontainer");
  // console.log("inside tree view setup div found");

  // Creating the hierarchy view with hierarchyArr data
  function createHierarchyView(hierarchyArr) {
    let html = `<ul class="folder-tree">`;

    // for (let i = 0; i < hierarchyArr.length; i++) {
    hierarchyArr.forEach((itemOrArray) => {
      // const item = hierarchyArr[i];
      // console.log("hierarchyArr",hierarchyArr);
      if (Array.isArray(itemOrArray)) {
        itemOrArray.forEach((item) => {
          html += `<liclass = "expandable"> <span>${item.name}</span> `;

          if (item.children && item.children.length > 0) {
            html += createHierarchyView(item.children);
          } else {
            console.log("no");
          }
          html += `</li>`;
        });
      } else {
        html += `<li class = "expandable"> <span>${itemOrArray.name}</span> `;

        if (itemOrArray.children && itemOrArray.children.length > 0) {
          const childrenLength = itemOrArray.children.length;
          console.log(
            `Children length for item with id ${itemOrArray.id}: ${childrenLength}`
          );

          // Recursive call to createHierarchyView for children
          html += createHierarchyView(itemOrArray.children);
        } else {
          console.log(`No children for item with id ${itemOrArray.id}`);
        }

        html += `</li>`;
      }
    });
    html += "</ul>";
    return html;
  }

  const treeDataContainer = document.querySelector(".rowdataviewcontainer");
  const html = createHierarchyView(hierarchyArr);
  if (treeDataContainer.innerHTML == "") {
    treeDataContainer.innerHTML = html;
  }

  // Functionality for Adding icons
  let uidata = document.querySelectorAll(".rowdataviewcontainer ul li");
  for (let i = 0; i < uidata.length; i++) {
    let data = uidata[i].innerHTML.includes("ul");
    let icon = document.createElement("div");
    icon.classList.add("arrow");
    if (data == true && uidata[i].querySelector("ul") != null) {
      icon.innerHTML = `<img src="${chrome.runtime.getURL(
        "images/arrow-right.png"
      )}" class="plus_icon_js"  />`;
      uidata[i].append(icon);
    } else {
      icon.innerHTML = `<img src="${chrome.runtime.getURL(
        "images/up-arrow.png"
      )}" class="width100"  />`;
      uidata[i].append(icon);
    }
  }

  // Functionality for expand and collepse the childrens
  var folderTreeList = document.querySelectorAll(".folder-tree li .arrow");
  folderTreeList.forEach(function (li) {
    if (li.firstChild.classList.contains("plus_icon_js")) {
      li.addEventListener("click", function (evt) {
        evt.target.parentElement.parentElement.classList.toggle("expanded");
        if (
          evt.target.parentElement.parentElement.classList.contains("expanded")
        ) {
          evt.target.classList.add("Rotate90");
        } else {
          evt.target.classList.remove("Rotate90");
        }
      });
    }
  });

  // Functionaltiy to set the data in Equipment search bar
  let livalue = document.querySelectorAll(".rowdataviewcontainer ul li span");
  for (let i = 0; i < livalue.length; i++) {
    livalue[i].addEventListener("click", function () {
      document.querySelector(".plex-dialog-close-icon").click();
      document.querySelector("#autoID16").value = livalue[i].innerText;
      searchIconClick();
    });
  }
}

// function For click on serach icon
function searchIconClick() {
  setTimeout(() => {
    document.querySelector(".plex-control-label #autoID42").click();
    // console.log("Clicked on search");
  }, 100);
}

// Authenication Api calling
chrome.storage.local.get(["TokenValue"]).then((result) => {
  authToken = result.TokenValue;
  var settings = {
    url: `${baseURL}/verify-pcn`,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      Plexus_Customer_No: pcn,
      Token: authToken,
    }),
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    // chrome.runtime.sendMessage({ type: 'data', data:response.exists });
    chrome.storage.local.set({ exists: response.exists });
    if (response.exists == true) {
      AuthSuccess();
    }
  });
});

// Define the function to handle the checkbox state change
// function handleCheckboxChange(isChecked) {
//   console.log(`Checkbox state changed: isChecked = ${isChecked}`);

//   const folderTreeList = document.querySelectorAll(".folder-tree li .arrow");
//   folderTreeList.forEach(function (li) {
//     if (li.firstChild.classList.contains("plus_icon_js")) {
//       if (isChecked) {
//         console.log("Expanding list item.");
//         // If checkbox is checked, open the list
//         li.parentElement.classList.add("expanded");
//         li.classList.add("Rotate90");
//       } else {
//         console.log("Collapsing list item.");
//         // If checkbox is unchecked, close the list
//         li.parentElement.classList.remove("expanded");
//         li.classList.remove("Rotate90");
//       }
//     }
//   });
// }

// // Listen for messages from the background script
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.action === "rotatePlusIcon") {
//     const isChecked = message.isChecked;
//     handleCheckboxChange(isChecked);
//     console.log(isChecked);
//   }
// });

// content.js

// // Function to handle the checkbox change
// function handleCheckboxChange(isChecked) {
//   console.log(`Checkbox state in content script: ${isChecked}`);
//   // Add your logic here based on the checkbox state
// }

// // Listen for messages from the popup script
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.action === "rotatePlusIcon") {
//     const isChecked = message.checked;
//     handleCheckboxChange(isChecked);
//     console.log(`Received message from popup: Checkbox is checked: ${isChecked}`);
//   }
// });

// Function to handle the checkbox change
// Function to handle the checkbox change
// function handleCheckboxChange(isChecked) {
//   console.log(`Checkbox state in content script: ${isChecked}`);

//   // Select the folder tree list
//   var folderTreeList = document.querySelectorAll(".folder-tree li");

//   // Define the click event handler function
//   function clickEventHandler(evt) {
//     evt.target.parentElement.parentElement.classList.toggle("expanded");
//     if (evt.target.parentElement.parentElement.classList.contains("expanded")) {
//       evt.target.classList.add("Rotate90");
//       console.log("Li element clicked and expanded.");
//     } else {
//       evt.target.classList.remove("Rotate90");
//       console.log("Li element clicked and collapsed.");
//     }
//   }

//   // If the checkbox is checked, trigger a click event on the li elements
//   if (isChecked) {
//     folderTreeList.forEach(function (li) {
//       if (li.firstChild.classList.contains("plus_icon_js")) {
//         // li.addEventListener("click", clickEventHandler);
//         li.click(); // Trigger a click event on the li element
//         console.log("Click event triggered on li element.");
//       }
//     });
//   } else {
//     // If the checkbox is unchecked, remove the click event listener
//     folderTreeList.forEach(function (li) {
//       if (li.firstChild.classList.contains("plus_icon_js")) {
//         li.removeEventListener("click", clickEventHandler);
//       }
//     });
//     console.log("Click event listener removed from li elements.");
//   }
// }

// Listen for messages from the popup script
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.action === "rotatePlusIcon") {
//     const isChecked = message.checked;

//     // Placeholder function for handling checkbox changes
//     function handleCheckboxChange(isChecked) {
//       // Replace this with your actual logic for handling checkbox changes
//       console.log("Checkbox state changed:", isChecked);
//       if (isChecked) {
//         // Checkbox is checked, perform actions
//         console.log("Checkbox is checked. Perform actions here.");
//       } else {
//         // Checkbox is unchecked, perform other actions
//         console.log("Checkbox is unchecked. Perform other actions here.");
//       }
//     }

//     handleCheckboxChange(isChecked);

//     console.log(
//       `Received message from popup: Checkbox is checked: ${isChecked}`
//     );

//     // Select the first li element within the folder-tree ul
//     var firstLiInFolderTree = document.querySelector(".folder-tree  li:first-child");
//     var Arrow = document.querySelectorAll(".plus_icon_js .arrow")
//     if (firstLiInFolderTree) {
//       if (isChecked === true) {
//         // Add the "expanded" class to the first li element
//         firstLiInFolderTree.classList.add("expanded");
//         console.log("Class added");
//         Arrow.classList.add("Rotate90")
//       } else {
//         // Remove the "expanded" class from the first li element
//         firstLiInFolderTree.classList.remove("expanded");
//         console.log("Class removed");
//         Arrow.classList.remove("Rotate90")
//       }
//     }
//   }
// });

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "rotatePlusIcon") {
    const isChecked = message.checked;

    // Placeholder function for handling checkbox changes
    function handleCheckboxChange(isChecked) {
      // Replace this with your actual logic for handling checkbox changes
      console.log("Checkbox state changed:", isChecked);
      if (isChecked) {
        // Checkbox is checked, perform actions
        console.log("Checkbox is checked. Perform actions here.");

        // Add the "expanded" class to the first li element
        var folderTreeItems = document.querySelectorAll(".folder-tree li");

        folderTreeItems.forEach(function (liElement) {
          // Add the "expanded" class to each li element
          liElement.classList.add("expanded");
          console.log("Class 'expanded' added");

          // Find all elements with the class "plus_icon_js" inside each li element
          var plusIcons = liElement.querySelectorAll(".plus_icon_js");

          // Loop through the found plus_icons and add the "Rotate90" class to each of them
          plusIcons.forEach(function (plusIcon) {
            plusIcon.classList.add("Rotate90");
            console.log("Class 'Rotate90' added to .plus_icon_js");
          });
        });
      } else {
        console.log("Checkbox is unchecked. Perform other actions here.");

        var firstLiInFolderTree = document.querySelector(".folder-tree li");
        if (firstLiInFolderTree) {
          firstLiInFolderTree.classList.remove("expanded");
          console.log("Class 'expanded' removed");

          // Remove the "Rotate90" class from the .plus_icon_js element
          var plusIcons = document.querySelectorAll(".plus_icon_js");
          plusIcons.forEach(function (plusIcon) {
            plusIcon.classList.remove("Rotate90");
          });
        }
      }
    }

    handleCheckboxChange(isChecked);

    console.log(
      `Received message from popup: Checkbox is checked: ${isChecked}`
    );
  }
});
