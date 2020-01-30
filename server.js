const http = require("http");
const { processRequest } = require("./app.js");

const requestListener = function(req, res) {
  const remote = {
    addr: req.socket.remoteAddress,
    port: req.socket.remotePort
  };
  console.warn("new Connection", remote);

  req.on("error", error => console.error(error));
  req.on("end", () => console.warn(remote, "end"));
  req.on("close", () => console.warn(remote, "closed"));

  processRequest(req, res);
};

const main = function() {
  const server = new http.Server(requestListener);
  server.on("listening", () =>
    console.warn("started listening", server.address())
  );
  server.listen(4000);
};

main();
