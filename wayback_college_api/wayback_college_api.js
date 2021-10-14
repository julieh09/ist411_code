const xhttpCollege = new XMLHttpRequest();

let collegeData = [];
let yearData = ["1996", "1997", "1998", "1999",
    "2000", "2001", "2002", "2003", "2004", "2005", "2006",
    "2007", "2008", "2009", "2010", "2011", "2012", "2013", 
    "2014", "2015", "2016", "2017", "2018", "2019", "2020",
    "2021"
];

function setTableContent() {
    let selectedCollege = document.getElementById("collegeDropdown");
    
    for (let i=0; i < collegeData.length; i++) {
        if (collegeData[i].name == selectedCollege.value) {
            let headerRow = document.createElement('tr');
            let dataRow = document.createElement('tr');

            for (const key in collegeData[i]) {
                let headerData = document.createElement('th');
                let headerText = document.createTextNode(key);
                headerData.appendChild(headerText);
                headerRow.appendChild(headerData);

                let data_data = document.createElement('td');
                let data_text = document.createTextNode(collegeData[i][key]);
                data_data.appendChild(data_text);
                dataRow.appendChild(data_data);
            }

            document.querySelector("#collegeTable").innerHTML = "";
            document.querySelector("#collegeTable").appendChild(headerRow);
            document.querySelector("#collegeTable").appendChild(dataRow);
            setIframeContent();

        }
    }
}

function setIframeContent() {
    let selectedCollege = document.getElementById("collegeDropdown");
    let selectedYear = document.getElementById("yearDropdown");

    for (let i=0; i<collegeData.length; i++) {
        if (collegeData[i].name == selectedCollege.value) {
            const xhttpWayback = new XMLHttpRequest();
            xhttpWayback.open("GET", `http://archive.org/wayback/available?url=${collegeData[i].domains[0]}&timestamp=${selectedYear.value}`);
            xhttpWayback.send();

            document.querySelector("#iframeDiv").innerHTML = "";

            xhttpWayback.onload = function() {
                waybackData = JSON.parse(this.responseText);

                if (this.status == 200) {
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

        setYearDropdownContent("#yearDropdown", yearData);
        setTableContent();

    } else {
        console.log(`${this.status} -- error querying US college API`);
    }
}

xhttpCollege.open("GET", "http://universities.hipolabs.com/search?country=United+States")
xhttpCollege.send();
