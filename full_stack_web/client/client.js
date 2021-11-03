function logDate() {
    const xhttpLogDate = new XMLHttpRequest();
    xhttpLogDate.open("POST", "http://127.0.0.1:5000/logdate");
    xhttpLogDate.send();

    xhttpLogDate.onload = function() {
        document.querySelector("#responseBox").innerHTML = this.responseText;
    }
}

function getDates() {
    const xhttpGetDate = new XMLHttpRequest();
    xhttpGetDate.open("GET", "http://127.0.0.1:5000/dates");
    xhttpGetDate.send();

    xhttpGetDate.onload = function() {
        document.querySelector("#responseBox").innerHTML = this.responseText;
    }
}

function sendInvalid() {
    const xhttpSendInvalid = new XMLHttpRequest();
    xhttpSendInvalid.open("GET", "http://127.0.0.1:5000/invalidroute");
    xhttpSendInvalid.send();

    xhttpSendInvalid.onload = function() {
        document.querySelector("#responseBox").innerHTML = this.responseText;
    }
}