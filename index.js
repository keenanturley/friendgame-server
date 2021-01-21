const WebSocket = require('ws');
const { GameServer } = require('./GameServer');

const WSS_HOST = 'localhost';
const WSS_PORT = 8080;

const wss = new WebSocket.Server({ port: WSS_PORT });

const gameServer = new GameServer(wss);

console.log('WSS started');