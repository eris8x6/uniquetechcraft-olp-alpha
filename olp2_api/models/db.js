const mongoose = require('mongoose');

/**
 * Config for local/default setup (dev and local server use)
 */

const config = {
    dbURI: 'mongodb://localhost/olprompter01'};

/**
 * Read .env for environment variables.
 */

require('dotenv').config();

const readLine = require('readline');

const dbURI = process.env.DATABASE_URI || config.dbURI;

mongoose.connect(dbURI, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    console.log(`Database connected: ${dbURI}`);
});
mongoose.connection.on('disconnected', () => {
    console.log('Database disconnected');
});
mongoose.connection.on('error', () => {
    console.log('Database connection error:', err);
});

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log(`Received ${msg}: Database disconnect requested.`);
        callback();
    });
};

if (process.platform === 'win32') {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('SIGUSR2', () => {
        process.emit("SIGUSR2");
    });
}

process.once('SIGUSR2', () => {
    gracefulShutdown('SIGUSR2 - nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});
process.on('SIGINT', () => {
    gracefulShutdown('SIGINT - app termination', () => {
        process.exit(0);
    });
});
process.on('SIGTERM', () => {
    gracefulShutdown('SIGTERM - Heroku app shutdown', () => {
        process.exit(0);
    });
});

require('./song');

