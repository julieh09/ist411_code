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
}

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
                console.log("Successfully saved session info.")
            }
        }
    );
}

// RESTful routes
// Add a new username
app.post("/newuser/:userName", (req, res) => {
    if (data.userList.indexOf(req.params.userName) == -1) {
        data.userList.push(req.params.userName);
        currentUser = req.params.userName;
        dumpFlatFile(data);
        res.send("1");
    } else {
        res.send("0");
    }
});

// Login using a username
app.get("/login/:userName", (req, res) => {
    if (data.userList.indexOf(req.params.userName) != -1) {
        currentUser = req.params.userName;
        res.send("1");
    } else {
        res.send("0");
    }
});

// Start server
app.listen(port, () => {
    console.log(`Starting server on port ${port}.\nWaiting for incoming connection.`);
    try {
        loadFlatFile();
    } catch (err) {
        console.log("No flat file from previous session.")
    }
});
