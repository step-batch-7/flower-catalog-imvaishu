const http = require('http');
const { app } = require('./lib/handlers');
const { stdout, stderr} = require('process');

const PORT = 4000;

const main = function() {
  const server = new http.Server(app.serve.bind(app));
  server.on('error', error => stderr.write(error));
  server.listen(PORT, () => stdout.write('listening to 4000'));
};

main();
