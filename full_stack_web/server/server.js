const http = require('http');
const fs = require('fs');

// There's no place like home
const hostname = "127.0.0.1"
const port = 5000;

const server = http.createServer((request, response) => {
    const {method, url} = request;

    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");

    // If else statement here to return information
    if (method === "POST" && url === "/logdate") {
        response.statusCode = 200;
        response.setHeader("Content-type", "text/plain");
        console.log("Received POST message from client. Logging current date and time.");
        
        // Log date and time information
        let dateTime = new Date();
        try {
            fs.appendFile(
            "datelog.txt",
            `${dateTime.getMonth()+1}/${dateTime.getDate()}/${dateTime.getFullYear()}-${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}\n`,
            (err) => {
                if (err) {
                    console.log(err);
                    throw err;
                } else {
                    console.log("Date and time log was successful!");
                }
            }
            )

            response.write("200 OK.")
            response.end();

        } catch (err) {
            console.log("Failed to log current date and time.");
            response.write("Failed to log current date and time.");
            response.end();
        }
        
    } else if (method === "GET" && url === "/dates") {
        response.statusCode = 200;
        response.setHeader("Content-type", "text/plain");
        console.log("Received GET message from client. Sending client logged dates.");

        try {
            const logData = fs.readFileSync("datelog.txt");
            response.write(logData);
            response.end();

        } catch (err) {
            console.log("No dates have been logged yet.");
            response.write("No dates have been logged yet.");
            response.end();
        }

    } else {
        response.statusCode = 404;
        console.log("Unknown request. Responding with 404 message.");
        response.setHeader("Content-type", "text/plain")
        response.write("Resource not available");
        response.end();
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at ${hostname}:${port}`);
    console.log(`Make sure to include 'http://' at the beginning of each request`);
})