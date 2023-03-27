async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

document.querySelector("#plexux").addEventListener("click", function () {
    window.open("https://cloud.plex.com/", '_blank').focus();
})
document.querySelector("#plexclassic").addEventListener("click", function () {
    window.open("https://www.plexonline.com/", '_blank').focus();
})

document.querySelector("#tokensavebtn").addEventListener("click", async function () {
    let value = document.querySelector("#Token_input").value
    chrome.storage.local.set({ TokenValue: value }).then(() => { });
    let tab = await getCurrentTab()
    chrome.tabs.update(tab.id, { url: tab.url });
})

chrome.storage.local.get(["TokenValue"]).then((result) => {
    Token = result.TokenValue
    if (Token) {
        document.querySelector("#Token_input").value = Token
    }
    console.log(Token);
})



var checkbox = document.querySelector("#EquipmentCheck");

chrome.storage.local.get(["ShowTree"]).then((result) => {
    checkboxvalue = result.ShowTree
    checkbox.checked = checkboxvalue
})


checkbox.addEventListener('change', async function () {
    if (this.checked) {
        console.log("Checkbox is checked..");
        chrome.storage.local.set({ ShowTree: true }).then(() => { });
        chrome.storage.local.get(["ShowTree"]).then((result) => {
            console.log(result.ShowTree);
        })
        let tab = await getCurrentTab()
        chrome.tabs.update(tab.id, { url: tab.url });

    } else {
        console.log("Checkbox is not checked..");
        chrome.storage.local.set({ ShowTree: false }).then(() => { });
        chrome.storage.local.get(["ShowTree"]).then((result) => {
            console.log(result.ShowTree);
        })
        let tab = await getCurrentTab()
        chrome.tabs.update(tab.id, { url: tab.url });
    }
});