#!/usr/bin/env node

/**
 * Config for local/default setup (dev and local server use)
 */

const config = {
    port: 5050,
    ip: "localhost"
};

/**
 * Read .env for default environment variables.
 */

require('dotenv').config();

/**
 * Module dependencies.
 */

var olp2 = require('./olp2');
var debug = require('debug')('outloudprompter-proto02:server');
var http = require('http');

/**
 * Get port and server IP from environment or config file and store in Express.
 * TODO use correct environment variables for Nodechef deploy
 * TODO use client environment file as fallback
 */

var port = normalizePort(process.env.PORT || config.port);
var ip = process.env.BIND_IP || config.ip;

if (ip && port) {
    olp2.set('port', port);
    olp2.set('ip', ip);
}
else {
    throw new Error("Port or IP value missing!");
}

/**
 * Create HTTP server.
 */

var server = http.createServer(olp2);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, ip);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
