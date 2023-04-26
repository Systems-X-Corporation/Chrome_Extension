// Function for Getting Current tab
async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

// Creating new window for cloud.plex on click
document.querySelector("#plexux").addEventListener("click", function () {
    window.open("https://cloud.plex.com/", '_blank').focus();
})
// Creating new window for plexonline on click
document.querySelector("#plexclassic").addEventListener("click", function () {
    window.open("https://www.plexonline.com/", '_blank').focus();
})

// Saving the token value in save btn
document.querySelector("#tokensavebtn").addEventListener("click", async function () {
    let value = document.querySelector("#Token_input").value
    // Save the token in local storage
    chrome.storage.local.set({ TokenValue: value }).then(() => { });
    // Reloading the page after click
    let tab = await getCurrentTab()
    chrome.tabs.update(tab.id, { url: tab.url });
})

// Getting the token and placing it into popup token input 
chrome.storage.local.get(["TokenValue"]).then((result) => {
    Token = result.TokenValue
    if (Token) {
        document.querySelector("#Token_input").value = Token
    }
    console.log(Token);
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

document.getElementById("Token_input").addEventListener("change", () => {
    let val = e.target.value
    if(val){
        document.getElementById("tokensavebtn").disabled = false
        document.getElementById("tokensavebtn").style.color = "#fff"

    }
    else {
        document.getElementById("tokensavebtn").disabled = true
        document.getElementById("tokensavebtn").style.color = "unset"
    }
})