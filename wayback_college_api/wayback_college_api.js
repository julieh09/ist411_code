const xhttpCollege = new XMLHttpRequest();
let collegeData = [];

function setTableContent() {
    let selectedCollege = document.getElementById("collegeDropdown");
    let checkBoxArray = [
        document.querySelector("#alpha_two_code").checked,
        document.querySelector("#web_pages").checked,
        document.querySelector("#name").checked,
        document.querySelector("#country").checked,
        document.querySelector("#domains").checked,
        document.querySelector("#state-province").checked
    ];
    
    for (let i=0; i < collegeData.length; i++) {
        if (collegeData[i].name == selectedCollege.value) {
            let headerRow = document.createElement('tr');
            let dataRow = document.createElement('tr');

            j = 0
            for (const key in collegeData[i]) {
                if (checkBoxArray[j] == true ) {
                let headerData = document.createElement('th');
                let headerText = document.createTextNode(key);
                headerData.appendChild(headerText);
                headerRow.appendChild(headerData);

                let data_data = document.createElement('td');
                let data_text = document.createTextNode(collegeData[i][key]);
                data_data.appendChild(data_text);
                dataRow.appendChild(data_data);
                }

                j += 1;
            }

            document.querySelector("#collegeTable").innerHTML = "";
            document.querySelector("#collegeTable").appendChild(headerRow);
            document.querySelector("#collegeTable").appendChild(dataRow);
        }
    }
}

function setIframeContent() {
    let selectedCollege = document.getElementById("collegeDropdown");
    let selectedYear = document.getElementById("yearTextBox");

    for (let i=0; i<collegeData.length; i++) {
        if (collegeData[i].name == selectedCollege.value) {
            const xhttpWayback = new XMLHttpRequest();
            xhttpWayback.open("GET", `http://archive.org/wayback/available?url=${collegeData[i].domains[0]}&timestamp=${selectedYear.value}`);
            xhttpWayback.send();

            document.querySelector("#iframeDiv").innerHTML = "";

            xhttpWayback.onload = function() {
                waybackData = JSON.parse(this.responseText);

                if (this.status == 200) {
                    if (parseInt(selectedYear.value) >= 1996 && parseInt(selectedYear.value) <= 2021) {
                        if (selectedYear.value != waybackData.archived_snapshots.closest.timestamp.substr(0, 4)) {
                            let headerData = document.createElement('h3');
                            let headerText = document.createTextNode(`No website found for ${selectedCollege.value} in ${selectedYear.value}`);
    
                            headerData.appendChild(headerText);
                            document.querySelector("#iframeDiv").appendChild(headerData);
    
                        } else {
                            console.log(`${this.status} -- successfully queried Wayback Machine API for timestamp ${selectedYear.value}`);
                            let headerData = document.createElement('h3');
                            let iframe = document.createElement('iframe');
                            let pageBreak = document.createElement('br');
    
                            let headerText = document.createTextNode(`What ${selectedCollege.value}'s website looked like in ${selectedYear.value}`)
                            headerData.appendChild(headerText);
    
                            iframe.setAttribute("src", waybackData.archived_snapshots.closest.url);
                            iframe.setAttribute("width", "100%");
                            iframe.setAttribute("height", "800px");
    
                            document.querySelector("#iframeDiv").appendChild(headerData);
                            document.querySelector("#iframeDiv").appendChild(iframe);
                            document.querySelector("#iframeDiv").appendChild(pageBreak);
                        }

                    } else {
                        let headerData = document.createElement('h3');
                        let headerText = document.createTextNode(`Invalid date specified. Please enter date between 1996 and 2021.`);

                        headerData.appendChild(headerText);
                        document.querySelector("#iframeDiv").appendChild(headerData);
                    }
                } else {
                    console.log(`${this.status} -- error querying Wayback Machine API`);
                }
            }
        }
    }
}

function setCollegeDropdownContent(dropdownID, dropdownContent) {
    let newElt = document.createElement('option');
    let textNode = document.createTextNode(dropdownContent);
    newElt.appendChild(textNode);

    if (dropdownContent == "Pennsylvania State University") {
        newElt.setAttribute("selected", true);
    }

    document.querySelector(dropdownID).appendChild(newElt);
}

function setYearDropdownContent(dropdownID, yearData) {
    for (let i=0; i<yearData.length; i++) {
        let newElt = document.createElement('option');
        let textNode = document.createTextNode(yearData[i]);
        newElt.appendChild(textNode);

        if (yearData[i] == "2002") {
            newElt.setAttribute("selected", true);
        }

        document.querySelector(dropdownID).appendChild(newElt);
    }
}

xhttpCollege.onload = function() {
    collegeData = JSON.parse(this.responseText);

    if (this.status == 200) {
        console.log(`${this.status} -- successfully queried US college API`);
        for (let i=0; i < collegeData.length; i++) {
            setCollegeDropdownContent("#collegeDropdown", collegeData[i].name);
        }
    } else {
        console.log(`${this.status} -- error querying US college API`);
    }
}

xhttpCollege.open("GET", "http://universities.hipolabs.com/search?country=United+States")
xhttpCollege.send();
