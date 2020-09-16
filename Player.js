class Player {
    id = "";
    name = "não nomeado";
    position_x = 0;
    position_y = 0; 
    time = 0;
    constructor(x, y, id, name = "não nomeado") {
        this.id = id;
        this.name = name;
        this.position_x = x;
        this.position_y = y;
        console.log(this.id);
    }
}
exports.Player = Player;
