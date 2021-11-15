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

// Function to modify the current view
function swapPage(pageName) {
    location.href = pageName;
}