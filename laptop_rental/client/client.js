function login() {
    const xhttpLogin = new XMLHttpRequest();

    let loginUser = document.getElementById("signInTextBox");
    xhttpLogin.open("GET", `http://127.0.0.1:5000/login/${loginUser.value}`);
    xhttpLogin.send();

    xhttpLogin.onload = function() {
        console.log(this.responseText);
    }
}

function createAccount() {
    const xhttpCreateAccount = new XMLHttpRequest();
    
    let newUser = document.getElementById("createUserTextBox");
    xhttpCreateAccount.open("POST", `http://127.0.0.1:5000/newuser/${newUser.value}`);
    xhttpCreateAccount.send();

    xhttpCreateAccount.onload = function() {
        console.log(this.responseText);
    }
}

// Function to modify the current view
function swapPage(pageName) {
    location.href = pageName;
}