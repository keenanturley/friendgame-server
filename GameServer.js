const { Player } = require('./Player');
const { randomCssColor } = require('./util');

const UPDATE_RATE = 20;

class GameServer {
    // Takes in a websocket server
    constructor(wss) {
        this.wss = wss;
        this.nextId = 0;
        // Map from player id -> player object
        this.players = new Map();
        // Map from socket -> player id
        this.sockets = new Map();
        this.start();
    }
    addPlayer(id, player) {
        this.players.set(id, player);
    }
    removePlayer(id) {
        this.players.delete(id);
    }
    start() {
        this.wss.on('connection', (socket) => {
            console.log('connection retrieved');
            this.connectPlayer(socket);
        })
        setInterval(() => {
            this.broadcastPlayers();
        }, Math.round((1 / UPDATE_RATE) * 1000));
        console.log('Game Server started');
    }
    connectPlayer(socket) {
        // Create a player for this network socket
        const id = (this.nextId)++;
        const player = new Player(id, randomCssColor());

        this.sockets.set(socket, id);
        this.addPlayer(id, player); 

        // Setup event listeners
        socket.on('close', () => {
            this.disconnectPlayer(socket);
        });
        socket.on('message', (jsonData) => {
            const data = JSON.parse(jsonData);
            if (data.type === 'fg_client_pos') {
                const id = this.sockets.get(socket);
                const player = this.players.get(id);
                player.x = data.pos.x;
                player.y = data.pos.y;
            }
        })

        socket.send(JSON.stringify({
            type: 'fg_connected',
            player: {
                id: player.id,
                color: player.color,
                x: player.x,
                y: player.y,
                height: player.height,
                width: player.width,
                speed: player.speed
            }
        }));

        console.log(`Player [${id}] connected!`);
    }
    disconnectPlayer(socket) {
        const id = this.sockets.get(socket);
        this.removePlayer(id);
        this.sockets.delete(socket);
    }
    broadcastPlayers() {
        if (this.sockets.length == 0) return;

        // Prepare the data
        const playersData = {};
        this.players.forEach((player) => {
            playersData[player.id] = player;
        });

        this.sockets.forEach((id, socket) => {
            socket.send(JSON.stringify({
                type: 'fg_players_update',
                players: playersData
            }));
        });
    }
}

exports.GameServer = GameServer;