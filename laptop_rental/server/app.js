// Necessary imports
const express = require("express");
const fs = require("fs");
const cors = require("cors");

// Global setup of server
let app = express();
app.use(cors());
let port = 5000;

// Globally accessible variables
let data = {
    "userList": [],
    "resList": []
};

let currentUser = "";

function loadFlatFile() {
    data = JSON.parse(fs.readFileSync("data.json", (err) => {
        if (err) {
            throw err;
        } else {
            console.log("Successfully loaded flat file from previous session");
        }
    }));
}

function dumpFlatFile(data) {
    fs.writeFile(
        "data.json",
        JSON.stringify(data),
        (err) => {
            if (err) {
                console.log(err);
                throw err;
            } else {
                console.log("Successfully saved session info.");
            }
        }
    );
}

// RESTful routes
// Add a new username
app.post("/newuser/:userName", (req, res) => {
    let responseData = {};
    console.log(`Received request to create new user ${req.params.userName}`);
    if (data.userList.indexOf(req.params.userName) == -1) {
        console.log(`Creating user ${req.params.userName}.`);
        data.userList.push(req.params.userName);
        currentUser = req.params.userName;
        dumpFlatFile(data);
        responseData.status = "1";
        responseData.name = req.params.userName;
        
    } else {
        console.log(`User ${req.params.userName} already exists`);
        responseData.status = "0";
    }

    res.send(JSON.stringify(responseData));
});

// Login using a username
app.get("/login/:userName", (req, res) => {
    let responseData = {};
    console.log(`Received request to login user ${req.params.userName}.`);
    if (data.userList.indexOf(req.params.userName) != -1) {
        console.log(`Successfully logged in user ${req.params.userName}`);
        currentUser = req.params.userName;
        responseData.status = "1";
        responseData.name = req.params.userName;
        
    } else {
        console.log(`User ${req.params.userName} does not exist.`);
        responseData.status = "0"
    }

    res.send(JSON.stringify(responseData));
});

// Logout of application
app.get("/logout", (req, res) => {
    console.log(`Logging out user ${currentUser}`);
    currentUser = "";
    res.send("200 OK.");
});

app.get("/currentuser", (req, res) => {
    res.send(currentUser);
});

// Start server
app.listen(port, () => {
    console.log(`Starting server on port ${port}.\nWaiting for incoming connection.`);
    try {
        loadFlatFile();
    } catch (err) {
        console.log("No flat file from previous session.");
    }
});
