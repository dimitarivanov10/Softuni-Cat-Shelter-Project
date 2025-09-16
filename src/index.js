import http from "http";
import fs from "fs/promises";

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    const homeHTML = await fs.readFile("./src/views/home/index.html", {encoding: "utf-8"});
    
    res.writeHead(200, {
      "content-type": "text/html",
    });
    
    res.write(homeHTML);
  } else if (req.url === "/styles/site.css") {
    const sitesCSS = await fs.readFile("./src/styles/site.css", {encoding: "utf-8"});
    res.writeHead(200, {
      "content-type": "text/css",
    });

    res.write(sitesCSS);
  }

  res.end();
});
server.listen(5000);

console.log("Server is listening on http://localhost:5000...");
