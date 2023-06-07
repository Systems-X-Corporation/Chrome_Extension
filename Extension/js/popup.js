// Function for Getting Current tab
async function getCurrentTab() {

    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
var input = document.getElementById("Token_input");
var checkbox = document.getElementById("EquipmentCheck");
let pcn
// Creating new window for cloud.plex on click
document.querySelector("#plexux").addEventListener("click", function () {
    window.open("https://cloud.plex.com/", '_blank').focus();
})
// Creating new window for plexonline on click
document.querySelector("#plexclassic").addEventListener("click", function () {
    window.open("https://www.plexonline.com/", '_blank').focus();
})
var button = document.getElementById("tokensavebtn");  

document.getElementById("Token_input").addEventListener("input", () => {
   console.log(input.value);    
    if (input.value.trim() !== "") {
      button.disabled = false;
      checkbox.disabled = false;
      checkbox.style.cursor = "pointer"
      button.style.backgroundColor="#2c6e3a";
      button.style.cursor="pointer";
      button.style.color="white";
      button.style.border = "2px solid white"
    } else {
      button.disabled = true;
      checkbox.disabled = true;
      checkbox.style.cursor = "default"
      button.style.backgroundColor= "#5a8e65";
      button.style.cursor="default";
      button.style.border = "2px solid #fa8178"
    }
})

// Saving the token value in save btn
document.querySelector("#tokensavebtn").addEventListener("click", async function () {
    let value = document.querySelector("#Token_input").value
    // Save the token in local storage
    chrome.storage.local.set({ TokenValue: value }).then(() => { 
    });
    // Reloading the page after click
    location.reload();
    let tab = await getCurrentTab()
    chrome.tabs.update(tab.id, { url: tab.url });
})

// Getting the token and placing it into popup token input 
chrome.storage.local.get(["TokenValue"]).then((result) => {
    Token = result.TokenValue
    console.log(Token);
    if (Token) {
        input.value = Token;
    }
    if (input.value.trim() !== "") {
        button.disabled = false;
        checkbox.disabled = false;
        checkbox.style.cursor = "pointer"
        button.style.backgroundColor="#2c6e3a";
        button.style.cursor="pointer";
        button.style.color="white";
        button.style.border = "2px solid white"
      } else {
        button.disabled = true;
        checkbox.disabled = true;
        checkbox.style.cursor = "default"
        button.style.backgroundColor= "#5a8e65";
        button.style.cursor="default";
        button.style.border = "2px solid #fa8178"
      }
})

var checkbox = document.querySelector("#EquipmentCheck");

// Getting the checkbox value and setting as default
chrome.storage.local.get(["ShowTree"]).then((result) => {
    checkboxvalue = result.ShowTree
    checkbox.checked = checkboxvalue
})

// Eventlistner for Checkbox
checkbox.addEventListener('change', async function () {
    if (this.checked) {
        // Setting the checkbox value to local storage
        chrome.storage.local.set({ ShowTree: true }).then(() => { });
        chrome.storage.local.get(["ShowTree"]).then((result) => {
        })
        // Reloading the page after click
        let tab = await getCurrentTab()
        chrome.tabs.update(tab.id, { url: tab.url });

    } else {
        // Setting the checkbox value to local storage
        chrome.storage.local.set({ ShowTree: false }).then(() => { });
        chrome.storage.local.get(["ShowTree"]).then((result) => {
        })
        // Reloading the page after click
        let tab = await getCurrentTab()
        chrome.tabs.update(tab.id, { url: tab.url });
    }
});




document.querySelector("#quicktoolimg").addEventListener("click", function () {
    window.open("https://www.systems-x.com/en-us/contact-us?hsCtaTracking=e9deae1e-b808-45f9-8eb5-58b99ac20974%7C42c15435-0f3e-4a85-8c8b-d0ab8be4fe67").focus();
}
)
chrome.storage.local.get(["TokenValue","pcn"]).then((result) => {
    pcn = result.pcn
    authToken = result.TokenValue;
    fetch('http://localhost:8000/verify-pcn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Plexus_Customer_No: pcn,
          Token: authToken
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if(data.exists){
            document.getElementById("isverify").innerHTML = "Verified Token";
        }else{
            document.getElementById("isverify").innerHTML = "Invalid Token";
        
        }
          // chrome.runtime.sendMessage({ type: 'data', data: data.exists });
        })
        .catch(error => console.error(error));
  });