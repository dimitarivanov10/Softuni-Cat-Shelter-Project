import http from "http";
import fs from "fs/promises";
import {getCats, saveCat} from "./data.js";

const server = http.createServer(async (req, res) => {
  let html;

  if (req.method === "POST") {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk.toString();
    });

    req.on("end", async() => {
      const searchParams = new URLSearchParams(data);
      const newCat = Object.fromEntries(searchParams.entries());
      await saveCat(newCat);

      res.writeHead(302, {
        "location": "/"
      });
      // Instantly redirecting to home page after submitting a form
    res.end();
    });
    return;
}

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
      const sitesCSS = await fs.readFile("./src/styles/site.css");
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

function readFile(path) {
  return fs.readFile(path, { encoding: "utf-8" });
}

async function homeView() {
  const html = await readFile("./src/views/home/index.html");
  const cats = await getCats();

  let catsHTML = "";
  if (cats.length > 0) {
    catsHTML = cats.map((cat) => catTemplate(cat)).join("\n");
  }else {
    catsHTML = "<span>No cats added</span>"
  }
  const result = html.replaceAll("{{cats}}", catsHTML);

  return result;
}

async function addBreedView() {
  const html = await readFile("./src/views/addBreed.html");
  return html;
}

async function addCatView() {
  const html = await readFile("./src/views/addCat.html");
  return html;
}

function catTemplate(cat) {
  return `
        <li>
                <img src=${cat.imageURL} alt=${cat.name}>
                <h3>${cat.name}</h3>
                <p><span>Breed: </span>${cat.breed}</p>
                <p><span>Description: </span>${cat.description}</p>
                <ul class="buttons">
                    <li class="btn edit"><a href="">Change Info</a></li>
                    <li class="btn delete"><a href="">New Home</a></li>
                </ul>
        </li>
    `;
}
server.listen(5000);

console.log("Server is listening on http://localhost:5000...");
