const http = require("http");
const { app } = require("./lib/handlers");

const main = function() {
  const server = new http.Server(app.serve.bind(app));
  server.on("error", error => console.error(error));
  server.listen(4000, () => console.log("listening to 4000"));
};

main();
