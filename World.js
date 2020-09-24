const EventEmitter = require('events');
const {Player} = require('./Player');
/**
 * Classe para definir o jogo atual
 */
class World extends EventEmitter {
  canvasWidth;
  canvasHeight;
  players = {};
  balls = {};
  score = {
    'red': 0,
    'blue': 0,
  };
  slowing = false;
  tween;
  /**
   * @param {Number} width
   * @param {Number} height
   */
  constructor(width, height) {
    super();
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.addBall(width/2, height/2);
  }
  /**
   * @param {String} socketId id do jogador
   * @param {String} team time do jogador
   * @param {String} name nome escolhido pelo jogador
   * @return {any} Retorna o objeto player
   */
  addPlayer(socketId, team, name) {
    return this.players[socketId] =
      new Player(100, 100, name, socketId, team);
  }
  /**
   * Move o jogador
   * @param {String} socketId
   * @param {Number} directionX
   * @param {Number} directionY
   * @return {any} Retorna o jogador movido
   */
  movePlayer(socketId, directionX, directionY) {
    const player = this.players[socketId];
    player.y = player.y + directionY;
    player.x = player.x + directionX;
    return player;
  }
  /**
   * @param {String} socketId
   */
  removePlayer(socketId) {
    delete this.players[socketId];
  }
  /**
   * @param {Number} x
   * @param {Number} y
   * @return {any} ball
   */
  addBall(x, y) {
    return this.balls['ball'] = {
      x: x,
      y: y,
      speedX: 0,
      speedY: 0,
    };
  }
  /**
   * @param {Number} vectorX
   * @param {Number} vectorY
   * @param {any} ball
   * @return {any} ball
   */
  chute(vectorX, vectorY) {
    const ball = this.balls['ball'];
    ball.speedX += vectorX;
    ball.speedY += vectorY;
    return ball;
  }
  /**
   * @return {any} ball
   */
  movingBall() {
    if (this.balls == undefined) {
      this.addBall(200, 200);
    }
    const ball = this.balls['ball'];

    ball.x += ball.speedX;
    ball.y += ball.speedY;
    if (ball.x >= this.canvasWidth) {
      this.score.red += 1;
      this.emit('score-update', this.score);
    }
    if (ball.x <= 0) {
      this.score.blue += 1;
      this.emit('score-update', this.score);
    }
    if (ball.x >= this.canvasWidth ||
      ball.y >= this.canvasHeight ||
      ball.x <= 0 || ball.y <= 0) {
      ball.x = this.canvasWidth / 2;
      ball.y = this.canvasHeight / 2;
    }
    if (ball.speedX != 0) {
      ball.speedX -= Math.sign(ball.speedX);
    }
    if (ball.speedY != 0) {
      ball.speedY -= Math.sign(ball.speedY);
    }

    this.balls['ball'] = ball;

    return ball;
  }
}
exports.World = World;


