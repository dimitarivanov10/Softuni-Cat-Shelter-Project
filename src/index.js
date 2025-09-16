import http from "http";

import homeHTML from "./home.html.js";
import homeCSS from "./home.css.js";

const server = http.createServer((req, res) => {
  if (req.url === "/") {
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
