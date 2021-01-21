const PLAYER_SIZE = 25

class Player {
    // color is a css color string (ex. 'rgb(255, 100, 9)')
    constructor(id, color, x = 0, y = 0, speed = 1) {
        this.id = id;
        this.color = color;
        this.x = x;
        this.y = y;
        this.height = PLAYER_SIZE;
        this.width = PLAYER_SIZE;
        this.speed = speed;
    }
}

exports.Player = Player;