import http from "http";
import homeCSS from "./home.css.js";
import fs from "fs/promises";

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    const homeHTML = await fs.readFile("./src/views/home/index.html", {encoding: "utf-8"});
    
    res.writeHead(200, {
      "content-type": "text/html",
    });
    
    res.write(homeHTML);
  } else if (req.url === "/styles/site.css") {
    res.writeHead(200, {
      "content-type": "text/css",
    });
    res.write(homeCSS);
  }

  res.end();
});
server.listen(5000);

console.log("Server is listening on http://localhost:5000...");
