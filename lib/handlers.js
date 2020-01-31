const fs = require('fs');
const querystring = require('querystring');
const { loadTemplate } = require('./viewTemplate');
const { App } = require('./app');

const MIME_TYPES = require('./mimeTypes');
const STATIC_FOLDER = `${__dirname}/../public`;
const COMMENTS_STORE_PATH = `${__dirname}/../data/comments.json`;
const STATUS_CODES = {
  NOT_FOUND: 404,
  REDIRECT: 303,
  METHOD_NOT_ALLOWED: 400
};

const convertToHtml = function (comment) {
  return `
  <tr>
    <td class = "name"><strong>${comment.name}</strong></td>
    <td class = "date">${comment.date}</td>
    <td class = "comment"><pre>${comment.comment}</pre></td>
  </tr>
`;
};

const updateToHtml = function (comments) {
  const htmlComments = comments.map(convertToHtml);
  return htmlComments.join('');
};

const updateDate = function (comment) {
  comment.date = new Date(comment.date).toLocaleString();
  return comment;
};

const getComments = function () {
  if (!fs.existsSync(COMMENTS_STORE_PATH)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(COMMENTS_STORE_PATH, 'utf-8'));
};

const addComment = function (query) {
  let comments = getComments();
  const date = new Date();
  const comment = { name: query.name, date, comment: query.comment };
  comments.unshift(comment);
  comments = JSON.stringify(comments);
  fs.writeFileSync(COMMENTS_STORE_PATH, comments, 'utf-8');
};

const addCommentAndRedirect = function (req, res) {
  const query = querystring.parse(req.body);
  addComment(query);
  res.writeHead(STATUS_CODES.REDIRECT, { location: 'guestBook.html' });
  res.end();
};

const serveGuestBookPage = function (req, res) {
  let comments = getComments();
  comments = comments.map(updateDate);
  comments = updateToHtml(comments);
  const content = loadTemplate('guestBook.html', { comments });
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', `${content.length}`);
  res.write(content);
  res.end();
};

const doesFileExists = function (path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const serveStaticPage = function (req, res, next) {
  const url = req.url === '/' ? '/index.html' : req.url;
  const absolutePath = STATIC_FOLDER + url;
  if (doesFileExists(absolutePath)) {
    return next();
  }
  const content = fs.readFileSync(absolutePath);
  const [, extension] = absolutePath.match(/.*\.(.*)$/);
  res.setHeader('Content-Type', `${MIME_TYPES[extension]}`);
  res.setHeader('Content-Length', `${content.length}`);
  res.end(content);
};

const readBody = function (req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const notFound = function (req, res) {
  res.statusCode = STATUS_CODES.NOT_FOUND;
  res.end('Not Found');
};

const methodNotAllowed = function (req, res) {
  res.writeHead(STATUS_CODES.METHOD_NOT_ALLOWED, 'Method Not Allowed');
  res.end();
};

const app = new App();

app.use(readBody);

app.post('/comment', addCommentAndRedirect);
app.get('', serveStaticPage);
app.get('/guestBook.html', serveGuestBookPage);
app.get('', notFound);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
