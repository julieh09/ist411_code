const xhttp_college = new XMLHttpRequest();
const xhttp_wayback = new XMLHttpRequest();

let college_data = [];

function setTableContent() {
    let selected_college = document.getElementById("collegeDropdown");
    
    for (let i=0; i < college_data.length; i++) {
        if (college_data[i].name == selected_college.value) {
            let headerRow = document.createElement('tr');
            let dataRow = document.createElement('tr');

            for (const key in college_data[i]) {
                let header_data = document.createElement('th');
                let header_text = document.createTextNode(key);
                header_data.appendChild(header_text);
                headerRow.appendChild(header_data);

                let data_data = document.createElement('td');
                let data_text = document.createTextNode(college_data[i][key]);
                data_data.appendChild(data_text);
                dataRow.appendChild(data_data);
            }

            document.querySelector("#collegeTable").innerHTML = "";
            document.querySelector("#collegeTable").appendChild(headerRow);
            document.querySelector("#collegeTable").appendChild(dataRow);
        }
    }
}

function setDropdownContent(dropdownID, dropdownContent) {
    let newElt = document.createElement('option');
    let textNode = document.createTextNode(dropdownContent);
    newElt.appendChild(textNode);

    document.querySelector(dropdownID).appendChild(newElt);
}

xhttp_college.onload = function() {
    college_data = JSON.parse(this.responseText);

    if (this.status == 200) {
        console.log(`${this.status} -- successfully queried US college API`)
        for (let i=0; i < college_data.length; i++) {
            setDropdownContent("#collegeDropdown", college_data[i].name)
        }

    } else {
        console.log(`${this.status} -- error query US college API`);
    }
}

xhttp_college.open("GET", "http://universities.hipolabs.com/search?country=United+States")
xhttp_college.send();
