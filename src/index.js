import http from "http";
import fs from "fs/promises";

const server = http.createServer(async (req, res) => {
  let html;
  switch (req.url) {
    case "/":
      html = await homeView();
      break;
    case "/cats/add-breed":
      html = await addBreedView();
      break;
      case "/cats/add-cat":
      html = await addCatView();
      break;
    case "/styles/site.css":
      const sitesCSS = await fs.readFile("./src/styles/site.css")
      res.writeHead(200, {
        "content-type": "text/css",
      });
      res.write(sitesCSS);
      res.end();
      return;
    default:
      return res.end();
  }
  res.writeHead(200, {
    "content-type": "text/html",
  });

  res.write(html);

  res.end();
});

function readFile(path){
    return fs.readFile(path, {encoding: "utf-8"});
}

async function homeView() {
  const html = await readFile("./src/views/home/index.html");
  return html;
}

async function addBreedView() {
  const html = await readFile("./src/views/addBreed.html");
  return html;
}

async function addCatView() {
  const html = await readFile("./src/views/addCat.html");
  return html;
}
server.listen(5000);

console.log("Server is listening on http://localhost:5000...");
