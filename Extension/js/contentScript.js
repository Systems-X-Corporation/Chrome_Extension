// console.log("hello World");
let data = [];
let hierarchyArr = [];
let pcnarr;
let authToken;

// For loop for finding the PCN number from frontend
let scripts = document.getElementsByTagName("script");
for (let i = 0; i < scripts.length; i++) {
  const script = scripts[i];
  if (script.innerHTML.includes("plex.appState")) {
    pcnarr = script.innerHTML;
    break;
  }
}
pcnarr = pcnarr.split("'")[1];
pcnarr = pcnarr.split("'")[0];
pcnarr = pcnarr.split(/\\/).join("");
pcnarr = JSON.parse(pcnarr);
const pcn = pcnarr.customer.pcn;
console.log(pcn);
// Adding the PCN number to the local storage
chrome.storage.local.set({ pcn: pcn }).then(() => {});

// Function for Calling Api
function requestingDataApi() {
  // If we open the https://cloud.plex.com then this if condition api called
  if (document.location.href.includes("https://cloud.plex.com/")) {
    var settings = {
      url: `https://cloud.plex.com/api/datasources/234347/execute?Content-Type=application/json;charset=utf-8&Accept=application/json&Accept-Encoding=gzio,deflate`,
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: "Basic U3lzdGVtc1hXc0BwbGV4LmNvbTphYWE2YTg2LTQxMw==",
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
  // If we open the https://test.cloud.plex.com then this if condition api called
  if (document.location.href.includes("https://test.cloud.plex.com/")) {
    console.log("hello test");
    var settings = {
      url: "https://test.cloud.plex.com/api/datasources/234347/execute?Content-Type=application/json;charset=utf-8&Accept=application/json&Accept-Encoding=gzio,deflate",
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: "Basic U3lzdGVtc1hXc0BwbGV4LmNvbTphYWE2YTg2LTQxMw==",
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
        showtreeview = result.ShowTree;
        console.log("result", result);
        if (showtreeview == true) {
          // Condition for Tree Token Value
          chrome.storage.local.get(["TokenValue"]).then((result) => {
            Token = result.TokenValue;
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
  // console.log("apirecallingFn called");
  if (data == 0) {
    // Calling the API Request function
    requestingDataApi();
  }
}

// Function for setting up the api data in tree view
async function treeviwrecall() {
  // Waiting for the element
  await waitForElement(".rowdataviewcontainer");

  // if (document.querySelector(".rowdataviewcontainer").innerHTML == '') {
  // console.log("inside if recallingFn");
  createTreeviweData();
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
function createTreeviweData() {
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

// Function for setting Tree view from hierarchyArr Array
async function settingTreeview() {
  await waitForElement(".rowdataviewcontainer");
  // console.log("inside tree view setup div found");

  // Creating the hierarchy view with hierarchyArr data
  function createHierarchyView(hierarchyArr) {
    let html = `<ul class="folder-tree">`;
    for (let i = 0; i < hierarchyArr.length; i++) {
      const item = hierarchyArr[i];
      html += `<li> <span>${item.name}</span> `;
      if (item.children && item.children.length > 0) {
        html += createHierarchyView(item.children);
      }
      html += `</li>`;
    }
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
    url: "http://localhost:8000/verify-pcn",
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
    chrome.storage.local.set({ exists: response.exists })
    if (response.exists == true) {
      AuthSuccess();
    }

  });
});
