import http from "http";

const server = http.createServer((req, res) => {
    res.write("Working!");

    res.end();
});
server.listen(5000);

console.log("Server is listening on http://localhost:5000...");