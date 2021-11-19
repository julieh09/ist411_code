// Global variables
let currentUser = "";

function login() {
    const xhttpLogin = new XMLHttpRequest();

    let loginUser = document.getElementById("signInTextBox");
    xhttpLogin.open("GET", `http://127.0.0.1:5000/login/${loginUser.value}`);
    xhttpLogin.send();

    xhttpLogin.onload = function() {
        responseData = JSON.parse(this.responseText);
        if (responseData.status == "1") {
            currentUser = responseData.name;
            swapPage("dashboard.html");
        }
    }
}

function logout() {
    const xhttpLogout = new XMLHttpRequest();

    xhttpLogout.open("GET", `http://127.0.0.1:5000/logout`);
    xhttpLogout.send();

    xhttpLogout.onload = function() {
        swapPage("index.html");
    }
}

function createAccount() {
    const xhttpCreateAccount = new XMLHttpRequest();
    
    let newUser = document.getElementById("createUserTextBox");
    xhttpCreateAccount.open("POST", `http://127.0.0.1:5000/newuser/${newUser.value}`);
    xhttpCreateAccount.send();

    xhttpCreateAccount.onload = function() {
        responseData = JSON.parse(this.responseText);
        if (responseData.status == "1") {
            currentUser = responseData.name;
            swapPage("dashboard.html");
        }
    }
}

function getCurrentUser() {
    const xhttpGetCurrentUser = new XMLHttpRequest();

    xhttpGetCurrentUser.open("GET", "http://127.0.0.1:5000/currentuser", false);
    xhttpGetCurrentUser.send();

    currentUser = xhttpGetCurrentUser.responseText;
}

function createReservation() {
    const xhttpCreateReservation = new XMLHttpRequest();

    laptop = document.getElementById("laptops");
    date = document.getElementById("date");
    time = document.getElementById("time");
    numHours = document.getElementById("numHours");

    xhttpCreateReservation.open("POST", `http://127.0.0.1:5000/createReservation/${laptop.value}/${date.value}/${time.value}/${numHours.value}`);
    xhttpCreateReservation.send();

    xhttpCreateReservation.onload = function() {
        console.log(this.responseText);
    }
}

function updateReservation() {
    const xhttpUpdateReservation = new XMLHttpRequest();

    laptop = document.getElementById("laptops");
    date = document.getElementById("date");
    time = document.getElementById("time");
    numHours = document.getElementById("numHours");

    xhttpUpdateReservation.open("POST", `http://127.0.0.1:5000/updateReservation/${laptop.value}/${date.value}/${time.value}/${numHours.value}`);
    xhttpUpdateReservation.send();

    xhttpUpdateReservation.onload = function() {
        console.log(this.responseText);
    }
}

function deleteReservation() {
    const xhttpDeleteReservation = new XMLHttpRequest();

    xhttpDeleteReservation.open("DELETE", "http://127.0.0.1:5000/deleteReservation");
    xhttpDeleteReservation.send();

    xhttpDeleteReservation.onload = function() {
        console.log(this.responseText);
    }

}

function viewReservation() {
    const xhttpViewReservation = new XMLHttpRequest();

    xhttpViewReservation.open("GET", "http://127.0.0.1:5000/viewReservation");
    xhttpViewReservation.send();

    xhttpViewReservation.onload = function() {
        // Present date information to user by displaying as a modal
        let dataArray = [];
        dataArray.push(JSON.parse(this.responseText));
        let newTable = tableBuilder(dataArray, ["Username", "Laptop", "Start Date", "Start Time", "# of Hours"]);
        document.querySelector("#resultHeader").innerHTML = `${currentUser}'s Reservation`;
        document.querySelector("#resultBody").innerHTML = "";
        document.querySelector("#resultBody").appendChild(newTable);
    }
}

function viewAllReservations() {
    const xhttpViewAllReservations = new XMLHttpRequest();

    xhttpViewAllReservations.open("GET", "http://127.0.0.1:5000/viewAllReservations");
    xhttpViewAllReservations.send();

    xhttpViewAllReservations.onload = function() {
        resz = JSON.parse(this.responseText);
        let newTable = tableBuilder(resz.data, ["Username", "Laptop", "Start Date", "Start Time", "# of Hours"]);
        document.querySelector("#resultHeader").innerHTML = "All Reservations";
        document.querySelector("#resultBody").innerHTML = "";
        document.querySelector("#resultBody").appendChild(newTable);
    }
}

// Function to modify the current view
function swapPage(pageName) {
    location.href = pageName;
}

function tableBuilder(tableData, tableHeaders) {
    // Create root node of table
    let tableRoot = document.createElement('table');
    tableRoot.setAttribute("class", "table");

    // Create table header
    let tableHeader = document.createElement('thead');
    let tableHeaderRow = document.createElement('tr');
    tableHeaders.forEach((elem) => {
        let tableH = document.createElement('th');
        let tableHText = document.createTextNode(elem);
        tableH.appendChild(tableHText);
        tableHeaderRow.appendChild(tableH);
    });
    tableHeader.appendChild(tableHeaderRow);
    tableRoot.appendChild(tableHeader);

    // Create table body
    let tableBody = document.createElement('tbody');
    tableData.forEach((elem) => {
        let tableBodyRow = document.createElement('tr');
        let name = document.createElement('td');
        let nameText = document.createTextNode(elem.username);
        name.appendChild(nameText);
        let laptop = document.createElement('td');
        let laptopText = document.createTextNode(elem.laptop);
        laptop.appendChild(laptopText);
        let startDate = document.createElement('td');
        let startDateText = document.createTextNode(elem.start_date);
        startDate.appendChild(startDateText);
        let startTime = document.createElement('td');
        let startTimeText = document.createTextNode(elem.start_time);
        startTime.appendChild(startTimeText);
        let numHours = document.createElement('td');
        let numHoursText = document.createTextNode(elem.num_hours);
        numHours.appendChild(numHoursText);
        tableBodyRow.appendChild(name);
        tableBodyRow.appendChild(laptop);
        tableBodyRow.appendChild(startDate);
        tableBodyRow.appendChild(startTime);
        tableBodyRow.appendChild(numHours);
        tableBody.appendChild(tableBodyRow);
    });
    tableRoot.appendChild(tableBody);

    return tableRoot;
}
