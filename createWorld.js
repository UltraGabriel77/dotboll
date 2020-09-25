const {io} = require('./index');

/**
 * Cria o mundo do jogo
 * @param {number} width
 * @param {number} height
 * @return {game} Mundo
 */
function createWorld(width, height) {
  const world = {
    canvasWidth: width,
    canvasHeight: height,
    players: {},
    balls: {},
    score: {
      'red': 0,
      'blue': 0,
    },
    addPlayer,
    movePlayer,
    removePlayer,
    addBall,
    chute,
    movingBall,
  };
  /**
   * @param {String} socketId id do jogador
   * @param {String} team time do jogador
   * @param {String} name nome escolhido pelo jogador
   * @return {any} Retorna o objeto player
   */
  function addPlayer(socketId, team, name) {
    return world.players[socketId] = {
      x: 100,
      y: 100,
      team: team,
      name: name,
      id: socketId,
      keys: [],
    };
  }
  /**
   * Move o jogador
   * @param {String} socketId
   * @param {Number} directionX
   * @param {Number} directionY
   * @return {any} Retorna o jogador movido
   */
  function movePlayer(socketId, directionX, directionY) {
    const player = world.players[socketId];
    player.y = player.y + directionY;
    player.x = player.x + directionX;
    return player;
  }
  /**
   * @param {String} socketId
   */
  function removePlayer(socketId) {
    delete world.players[socketId];
  }
  /**
   * @param {Number} x
   * @param {Number} y
   * @return {any} ball
   */
  function addBall(x, y) {
    return world.balls['ball'] = {
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
  function chute(vectorX, vectorY) {
    const ball = world.balls['ball'];
    ball.speedX = vectorX;
    ball.speedY = vectorY;
    return ball;
  }
  /**
   * @return {any} ball
   */
  function movingBall() {
    if (world.balls['ball'] == undefined) {
      world.addBall(200, 200);
    }
    const ball = world.balls['ball'];

    ball.x += ball.speedX;
    ball.y += ball.speedY;
    changeScore();
    if (ball.speedX != 0) {
      ball.speedX -= Math.sign(ball.speedX);
    }
    if (ball.speedY != 0) {
      ball.speedY -= Math.sign(ball.speedY);
    }

    world.balls['ball'] = ball;

    return ball;

    /**
     * muda a pontuação
     */
    function changeScore() {
      if (ball.x >= world.canvasWidth) {
        world.score.red += 1;
        io.emit('score-update', world.score);
      }
      if (ball.x <= 0) {
        world.score.blue += 1;
        io.emit('score-update', world.score);
      }
      if (ball.x >= world.canvasWidth ||
        ball.y >= world.canvasHeight ||
        ball.x <= 0 || ball.y <= 0) {
        ball.x = world.canvasWidth / 2;
        ball.y = world.canvasHeight / 2;
      }
    }
  }
  return world;
}
exports.createWorld = createWorld;
