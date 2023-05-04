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
    chrome.storage.local.set({ TokenValue: value }).then(() => { 
        // document.querySelector("#Token_input").value =" ";
        // document.querySelector("#Token_input").ariaPlaceholder =" Enter value";
    });
    // Reloading the page after click
    location.reload();
    let tab = await getCurrentTab()
    chrome.tabs.update(tab.id, { url: tab.url });

    // chrome.storage.local.get('inputText', function() {
    //    document.getElementById('Token_input').value = '';
    //   })
    //   chrome.storage.local.remove('inputText', function() {
    //     document.getElementById('Token_input').value = ''; 
    //   });
    
})

// Getting the token and placing it into popup token input 
chrome.storage.local.get(["TokenValue"]).then((result) => {
    Token = result.TokenValue
    console.log(Token);
    if (Token) {
        document.querySelector("#Token_input").value = Token;
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

// document.getElementById("Token_input").addEventListener("change", () => {
//     let val = e.target.value
//     if(val){
//         document.getElementById("tokensavebtn").disabled = false
//         document.getElementById("tokensavebtn").style.color = "#fff"

//     }
//     else {
//         document.getElementById("tokensavebtn").disabled = true
//         document.getElementById("tokensavebtn").style.color = "unset"
//     }
// })



document.getElementById("Token_input").addEventListener("input", () => {
    var input = document.getElementById("Token_input");
    var button = document.getElementById("tokensavebtn");
    var checkbox = document.getElementById("EquipmentCheck");
    if (input.value.trim() !== "") {
      button.disabled = false;
      checkbox.disabled = false;
      button.style.backgroundColor="#2c6e3a";
      button.style.cursor="pointer";
      button.style.color="white";
      button.style.border = "2px solid white"
    } else {
      button.disabled = true;
      checkbox.disabled = true;
      button.style.backgroundColor= "#5a8e65";
      button.style.cursor="default";
      button.style.border = "2px solid red"
    }
})


document.querySelector("#quicktoolimg").addEventListener("click", function () {
    window.open("https://www.systems-x.com/en-us/contact-us?hsCtaTracking=e9deae1e-b808-45f9-8eb5-58b99ac20974%7C42c15435-0f3e-4a85-8c8b-d0ab8be4fe67").focus();
}
)
chrome.storage.local.get(["exists"]).then((result) => {
console.log(result.exists);
if(result.exists){
    document.getElementById("isverify").innerHTML = "verify";
}else{
    document.getElementById("isverify").innerHTML = "not verify";

}
})
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === 'data') {
//         // Use the data from the message
//         const data = message.data;
//         console.log(data);
//       }
// })