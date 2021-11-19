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

// Return the user currently logged into the system
app.get("/currentuser", (req, res) => {
    res.send(currentUser);
});

// Create reservation
app.post("/createReservation/:laptop/:date/:time/:numHours", (req, res) => {
    console.log(`Received request for reservation from ${currentUser}.`);
    
    // Array object to store reservation data
    let resz = {
        "username": currentUser,
        "laptop": req.params.laptop,
        "start_date": req.params.date,
        "start_time": req.params.time,
        "num_hours": req.params.numHours
    }

    // Check if the user already has a reservation
    const userIndex = data.resList.findIndex((elem) => {elem.username == currentUser});

    if (userIndex == -1) {
        data.resList.push(resz);
        dumpFlatFile(data);
        res.send("200 OK.");

    } else {
        res.send("504 - USER ALREADY EXISTS.");
    }
});

// Update reservation
app.post("/updateReservation/:newLaptop/:newDate/:newTime/:newHoursMax", (req, res) => {
    console.log(`Received request to update reservation from ${currentUser}.`);

    // Updated reservation
    let resz = {
        "username": currentUser,
        "laptop": req.params.newLaptop,
        "start_date": req.params.newDate,
        "start_time": req.params.newTime,
        "num_hours": req.params.newHoursMax
    }

    // Locate users reservation
    const userIndex = data.resList.findIndex((elem) => elem.username == currentUser);

    if (userIndex != -1) {
        data.resList[userIndex] = resz;
        dumpFlatFile(data);
        res.send("200 OK.");

    } else {
        res.send("504 - USER DOES NOT HAVE A RESERVATION");
    }

});

// Delete reservation
app.delete("/deleteReservation", (req, res) => {
    console.log(`Received request to delete reservation from ${currentUser}.`);

    // Locate users index
    const userIndex = data.resList.findIndex((elem) => elem.username == currentUser);

    if (userIndex != -1) {
        data.resList.splice(userIndex, 1);
        dumpFlatFile(data);
        res.send("200 OK.");

    } else {
        res.send("504 - USER HAS NO RESERVATION TO DELETE");
    }
});

// View reservation
app.get("/viewReservation", (req, res) => {
    console.log(`Received request to view reservation from ${currentUser}.`);

    // Retreive user's index
    const userIndex = data.resList.findIndex((elem) => elem.username == currentUser);

    if (userIndex != -1) {
        res.send(data.resList[userIndex]);

    } else {
        res.send("504 - USER HAS NO RESERVATION TO VIEW");
    }

});

// View all reservations
app.get("/viewAllReservations", (req, res) => {
    console.log(`Received request to view all reservations from ${currentUser}.`);

    // Sort array by date and start time in descending order
    data.resList.sort((res1, res2) => {
        return new Date(res1.start_date) - new Date(res2.start_date);
    });

    res.send({"data": data.resList});
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
