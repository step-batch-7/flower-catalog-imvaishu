const fs = require("fs");
const querystring = require("querystring");
const { loadTemplate } = require("./lib/viewTemplate");

const MIME_TYPES = require("./lib/mimeTypes");
const STATIC_FOLDER = `${__dirname}/public`;
const COMMENTS_STORE_PATH = `${__dirname}/data/comments.json`;

const notFound = function(req, res) {
  res.writeHead(404, { "Content-Length": 0 });
  res.end();
};

const serveStaticPage = function(req, res) {
  const url = req.url === "/" ? "/index.html" : req.url;
  const path = STATIC_FOLDER + url;
  if (!fs.existsSync(path)) return notFound(req, res);
  const content = fs.readFileSync(path);

  const [, extension] = path.match(/.*\.(.*)$/);
  res.setHeader("Content-Type", `${MIME_TYPES[extension]}`);
  res.setHeader("Content-Length", `${content.length}`);
  res.end(content);
};

const serveGuestBookPage = function(req, res) {
  const content = loadTemplate("guestBook.html", { comments: "" });
  res.setHeader("Content-Type", `text/html`);
  res.setHeader("Content-Length", `${content.length}`);
  res.write(content);
  res.end();
};

const getComments = function() {
  if (!fs.existsSync(COMMENTS_STORE_PATH)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(COMMENTS_STORE_PATH, "utf-8"));
};

const addComment = function(query) {
  let comments = getComments();
  const date = new Date();
  const comment = { name: query.name, date, comment: query.comment };
  comments.unshift(comment);
  comments = JSON.stringify(comments);
  fs.writeFileSync(COMMENTS_STORE_PATH, comments, "utf-8");
};

const addCommentAndRedirect = function(req, res) {
  let queryText = "";
  req.on("data", chunk => (queryText += chunk));
  req.on("end", () => {
    const query = querystring.parse(queryText);
    addComment(query);
    res.writeHead(303, { location: "guestBook.html" });
    res.end();
  });
};

const findHandler = function(req) {
  if (req.method === "POST" && req.url === "/comment")
    return addCommentAndRedirect;
  if (req.method === "GET" && req.url === "/guestBook.html")
    return serveGuestBookPage;
  if (req.method === "GET") return serveStaticPage;
};

const processRequest = function(req, res) {
  const handler = findHandler(req);
  handler(req, res);
};

module.exports = { processRequest };
