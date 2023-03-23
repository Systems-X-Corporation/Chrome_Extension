console.log("hello World");

let Last_DAta = []
let treedata = []
let lengthdata = []
let pattern = /^[1-9]\d*(\.[1-9]\d*)*/gm;
const Data = []
prev_element_len = 0
zero_len = []
last_parent_idx = 0
last_parent_adr = 0
final_data = []

document.querySelector(".plex-element-list .plex-picker-control .plex-picker-icon").addEventListener("click", function () {

    chrome.storage.local.get(["ShowTree"]).then((result) => {
        showtreeview = result.ShowTree
        console.log(showtreeview);
        if (showtreeview == true) {
            chrome.storage.local.get(["TokenValue"]).then((result) => {
                Token = result.TokenValue
                if (Token) {
                    console.log("clicked");
                    findingPickerSearchResult()
                    tabledataExtractor()
                }
            })
        }
    })

})

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

// To Extract Table data
async function tabledataExtractor() {
    console.log("clicked////////////////////////////////////");
    await waitForElement(".plex-grid-wrapper table tbody tr")
    let tablerow = document.querySelectorAll(".plex-grid-wrapper table tbody tr")
    let DataArr = []
    let matchPatterns = []
    for (let i = 0; i < tablerow.length; i++) {
        let pattern = /^[1-9]\d*(\.[1-9]\d*)*/gm;
        if (tablerow[i].querySelector("td:nth-child(3)").innerHTML.match(pattern)) {
            DataArr.push({
                name: tablerow[i].querySelector("td:nth-child(3)").innerHTML
            })

        } else {
            matchPatterns.push({
                name: tablerow[i].querySelector("td:nth-child(3)").innerHTML
            })

        }
    }
    // -----------------------------------------------------
    function cal_len(elem) {
        if (elem) {
            let splitdata = elem[0].split('.')
            return splitdata.length
        }
        else {
            return 0
        }
    }

    for (let i = 0; i < DataArr.length; i++) {
        let el = DataArr[i]
        let elem = DataArr[i].name.match(pattern)
        let len = cal_len(elem)
        let obj = { "name": DataArr[i].name, "children": [], len: len }
        Data.push(obj)
    }

    Data.sort(function (a, b) {
        return a.len - b.len;
    });


    function find_parent(final_data, child_adr) {

        parent_adr = final_data[0]
        for (let index = 1; index < final_data.length; index++) {
            if (child_adr.name == final_data[index].name) {
                return parent_adr
            }
            parent_adr = final_data[index]
        }
        return parent_adr
    }


    for (let i = 0; i < Data.length; i++) {
        const element_i = Data[i];
        cur_element_len = Data[i].len;
        if (element_i.len === 0) {
            obj = { name: element_i.name, children: [] }
            zero_len.push(obj)
            continue
        }

        if (final_data.length == 0) {
            obj = { name: element_i.name, children: [] }
            final_data.push(obj)
            last_parent_idx = final_data.length - 1
            prev_element_len = Data[i].len;
            last_parent_adr = obj
            continue
        }

        if (cur_element_len == prev_element_len) {
            let parent_element = find_parent(final_data, last_parent_adr)
            data_obj = { name: element_i.name, children: [] }
            parent_element.children.push(data_obj);
            continue
        }

        if (cur_element_len > prev_element_len) {
            let parent_element = last_parent_adr
            obj = { name: element_i.name, children: [] }
            parent_element.children.push(obj);
            last_parent_idx = i - 1
            last_parent_adr = obj
            prev_element_len = cur_element_len
        }
    }
    // console.log(final_data);
    // console.log(matchPatterns);
    let final_array_data = final_data.concat(matchPatterns)
    // console.log(final_array_data);
    // -----------------------------------------------------
    Last_DAta = final_array_data

    // settingTreeview()
}

async function findingPickerSearchResult() {

    await waitForElement(".plex-picker-search-results")

    let pixcelSearchResult = document.querySelector(".plex-picker-search-results")
    let pixcelSearchSection = document.querySelector(".plex-picker-search-section")
    let tableandrowelement = document.createElement("div")
    tableandrowelement.setAttribute("id", "Table_And_Row_Switch_Section");
    tableandrowelement.innerHTML = `
            <input type="radio" id="Table_And_Row_Radio_Btn" name="Row_and_Tree_view" value="Show_table" checked="checked">
            <label for= "html" >Show table</label >
            <input type="radio" id="Table_And_Row_Radio_Btn" name="Row_and_Tree_view" value="Show_tree">
            <label for="css">Show tree</label>
            `
    pixcelSearchResult.prepend(tableandrowelement)

    let rowdataviewcontainer = document.createElement("div")
    rowdataviewcontainer.classList.add("rowdataviewcontainer")
    rowdataviewcontainer.classList.add("display-none")
    pixcelSearchResult.append(rowdataviewcontainer)


    let radioBtnRowTable = document.querySelectorAll("#Table_And_Row_Radio_Btn")
    for (let i = 0; i < radioBtnRowTable.length; i++) {
        radioBtnRowTable[i].addEventListener("click", function () {
            let radioBtnValue = $("input[type='radio'][name='Row_and_Tree_view']:checked").val()
            // console.log(radioBtnValue);
            if (radioBtnValue == "Show_table") {
                showTableView()
            } else if (radioBtnValue == "Show_tree") {
                showRowView()
            }
        })
    }
    // document.querySelector(".plex-picker-search .plex-picker-search-buttons .btn-default").addEventListener("click", function () {
    //     console.log("clicked");
    //     tabledataExtractor()
    //     settingTreeview()

    // })
}

function showTableView() {
    document.querySelector(".plex-picker-content").classList.remove("display-none");
    document.querySelector(".rowdataviewcontainer").classList.add("display-none");
}

function showRowView() {
    settingTreeview()
    console.log(Last_DAta);
    document.querySelector(".plex-picker-content").classList.add("display-none");
    document.querySelector(".rowdataviewcontainer").classList.remove("display-none");
}



function settingTreeview() {

    function createHierarchyView(Last_DAta) {
        let html = `<ul class="folder-tree">`;
        for (let i = 0; i < Last_DAta.length; i++) {
            const item = Last_DAta[i];
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
    // const Data = [{
    //     "name": "6.1.1 Engle Press 1 -",
    //     "children": [
    //         {
    //             "name": "6.1.1.1 Hydraulic Unit -",
    //             "children": [
    //                 { "name": "6.1.1.1.1.1 Hydraulic Pump -" }
    //             ]
    //         }
    //     ]
    // },
    // { "name": "A-1 - A-line Press" },
    // { "name": "A-2 - A-line Press" },
    // { "name": "A-3 - A-line Press" },
    // { "name": "C-1 - A-line Press" },
    // { "name": "c-2 - A-line Press" },
    // ]
    const html = createHierarchyView(Last_DAta);
    // appending html
    treeDataContainer.innerHTML = html;

    let uidata = document.querySelectorAll(".rowdataviewcontainer ul li")
    for (let i = 0; i < uidata.length; i++) {
        let data = uidata[i].innerHTML.includes("ul")
        let icon = document.createElement("div")
        icon.classList.add("arrow")
        if (data == true && uidata[i].querySelector("ul") != null) {
            icon.innerHTML = `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit plus_icon_js" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: 20px; height: 20px; color: rgb(0, 0, 0);"><path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z"></path></svg>`
            uidata[i].append(icon);
        }
        else {
            icon.innerHTML = `<svg class="MuiSvgIcon-root close MuiSvgIcon-fontSizeInherit" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: 20px; height: 20px; color: rgb(0, 0, 0);"><path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z"></path></svg>`
            uidata[i].append(icon);

        }
    }

    var folderTreeList = document.querySelectorAll('.folder-tree li .arrow');
    folderTreeList.forEach(function (li) {
        if (li.firstChild.classList.contains("plus_icon_js")) {

            li.addEventListener('click', function (evt) {
                evt.target.parentElement.parentElement.classList.toggle('expanded');
                if (evt.target.parentElement.parentElement.classList.contains("expanded")) {
                    evt.target.innerHTML = `<path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z"></path>`
                } else {
                    evt.target.innerHTML = `<path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z"></path>`
                }
            });
        }

    });
    var folderTreeList1 = document.querySelectorAll('.folder-tree li .arrow svg');
    folderTreeList1.forEach(function (li) {
        if (li.firstChild.classList.contains("plus_icon_js")) {

            li.addEventListener('click', function (evt) {
                evt.target.parentElement.parentElement.parentElement.classList.toggle('expanded');
                if (evt.target.parentElement.parentElement.parentElement.classList.contains("expanded")) {
                    evt.target.innerHTML = `<path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z"></path>`
                } else {
                    evt.target.innerHTML = `<path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z"></path>`
                }
            });
        }

    });

    let livalue = document.querySelectorAll(".rowdataviewcontainer ul li span")
    for (let i = 0; i < livalue.length; i++) {
        livalue[i].addEventListener("click", function () {
            document.querySelector(".plex-dialog-close-icon").click()
            document.querySelector("#autoID16").value = livalue[i].innerText
            searchIconClick()
        })

        // console.log(livalue[i].innerText, i)
    }
}


function searchIconClick() {
    setTimeout(() => {
        document.querySelector(".plex-control-label #autoID42").click()
        console.log("Clicked on search");
    }, 100);
}



Rows = [
    { "EquipmentKey": 184928, "EquipmentType": "L1 - Asset", "EquipmentID": "6.1.1 Engle Press 1", "Description": "", "FullDescription": "6.1.1 Engle Press 1 -", "Location": "Ford U625 Engine Rail", "BuildingCode": "Corporate" },
    { "EquipmentKey": 184929, "EquipmentType": "L2 - Functional Assembly", "EquipmentID": "6.1.1.1 Hydraulic Unit", "Description": "", "FullDescription": "6.1.1.1 Hydraulic Unit -", "Location": "Ford U625 Engine Rail", "BuildingCode": "Corporate" },
    { "EquipmentKey": 184930, "EquipmentType": "L3 - Axis", "EquipmentID": "6.1.1.1.1.1 Hydraulic Pump", "Description": "", "FullDescription": "6.1.1.1.1.1 Hydraulic Pump -", "Location": "Ford U625 Engine Rail", "BuildingCode": "Corporate" },
    { "EquipmentKey": 174411, "EquipmentType": "Press - Automatic", "EquipmentID": "A-1", "Description": "A-line Press", "FullDescription": "A-1 - A-line Press", "Location": "", "BuildingCode": null },
    { "EquipmentKey": 174412, "EquipmentType": "Press - Automatic", "EquipmentID": "A-2", "Description": "A-line Press", "FullDescription": "A-2 - A-line Press", "Location": "", "BuildingCode": null },
    { "EquipmentKey": 174413, "EquipmentType": "Press - Automatic", "EquipmentID": "A-3", "Description": "A-line Press", "FullDescription": "A-3 - A-line Press", "Location": "", "BuildingCode": null },
    { "EquipmentKey": 174414, "EquipmentType": "Press - Automatic", "EquipmentID": "C-1", "Description": "C-line Press", "FullDescription": "C-1 - C-line Press", "Location": "", "BuildingCode": null },
    { "EquipmentKey": 174415, "EquipmentType": "Press - Automatic", "EquipmentID": "C-2", "Description": "C-line Press", "FullDescription": "C-2 - C-line Press", "Location": "", "BuildingCode": null }]