/**
 * Jogador
 * @property {number} time
 */
class Player {
/**
* Cria um jogador
* @param {number} x posição x
* @param {number} y posição y
* @param {String} id id do jogador
* @param {String} name nome do Jogador
* @param {Number} time
*/
  constructor(x, y, id, name = 'não nomeado', time=0) {
    this.id = id;
    this.name = name;
    this.position_x = x;
    this.position_y = y;
    this.time = time;
    console.log(this.id);
  }
}
exports.Player = Player;
