/**
 * Classe do jogador
 */
class Player {
  x;
  y;
  name;
  socketId;
  team;
  /**
   * @param {Number} x
   * @param {Number} y
   * @param {String} name
   * @param {String} socketId
   * @param {String} team
   */
  constructor(x, y, name, socketId, team) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.socketId = socketId;
    this.team = team;
  }
}
exports.Player = Player;
