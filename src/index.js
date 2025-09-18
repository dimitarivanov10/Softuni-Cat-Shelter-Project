import http from "http";
import fs from "fs/promises";
import { editCat, getCat, getCats, saveCat } from "./data.js";

const server = http.createServer(async (req, res) => {
  let html;

  if (req.method === "POST") {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk.toString();
    });

    req.on("end", async () => {
      const searchParams = new URLSearchParams(data);
      const newCat = Object.fromEntries(searchParams.entries());

      if (req.url === "/cats/add-cat") {
        await saveCat(newCat);
      } else if (req.url.startsWith("/cats/edit-cat")) {
        const catId = getCatId(req.url);
        await editCat(catId, newCat);
      }

      res.writeHead(302, {
        location: "/",
      });
      // Instantly redirecting to home page after submitting a form
      res.end();
    });
    return;
  }

  if (req.url.startsWith("/cats/edit-cat")) {
    const catId = getCatId(req.url);
    html = await editCatView(catId);
  } else {
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
          "cache-control": "max-age=10",
        });

        res.write(sitesCSS);
        res.end();
        return;
      default:
        return res.end();
    }
  }

  res.writeHead(200, {
    "content-type": "text/html",
  });

  res.write(html);

  res.end();
});

function getCatId(url) {
  const segments = url.split("/");
  const catId = Number(segments[3]);
  return catId;
}

function readFile(path) {
  return fs.readFile(path, { encoding: "utf-8" });
}

async function homeView() {
  const html = await readFile("./src/views/home/index.html");
  const cats = await getCats();

  let catsHTML = "";
  if (cats.length > 0) {
    catsHTML = cats.map((cat) => catTemplate(cat)).join("\n");
  } else {
    catsHTML = "<span>No cats added</span>";
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

async function editCatView(catId) {
  const cat = await getCat(catId);

  let html = await readFile("./src/views/editCat.html");
  html = html.replaceAll("{{name}}", cat.name);
  html = html.replaceAll("{{description}}", cat.description);
  html = html.replaceAll("{{imageURL}}", cat.imageURL);

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
                    <li class="btn edit"><a href="/cats/edit-cat/${cat.id}">Change Info</a></li>
                    <li class="btn delete"><a href="">New Home</a></li>
                </ul>
        </li>
    `;
}
server.listen(5000);

console.log("Server is listening on http://localhost:5000...");
