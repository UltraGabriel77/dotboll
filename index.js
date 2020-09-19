const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


// eslint-disable-next-line no-unused-vars
const game = createGame();
game.addBall(200, 200);
app.get('/', (_req, res)=>{
  res.sendFile(__dirname + '/index.html');
});
app.get('/game.js', (_req, res)=>{
  res.sendFile(__dirname + '/game.js');
});

io.on('connection', (socket)=>{
  console.log('User conected: ' + socket.id);
  socket.emit('boostrap', game);
  socket.on('disconnect', () => {
    console.log('user disconnected: '+ socket.id);
    io.emit('disconnect', game.players[socket.id]);
    game.removePlayer(socket.id);
  });
  socket.on('set-team', (socketId, team, name)=>{
    const player = game.addPlayer(socketId, team, name);
    console.log(player.name + ' entrou para o time ' + team);
    player.team = team;
    io.emit('new-player', {
      socketId: socketId,
      novoState: player,
    });
  });
  socket.on('move-player', (socketId, directionX, directionY)=>{
    console.log(directionY);
    game.players[socketId] = game.movePlayer(socketId, directionX, directionY);
    socket.broadcast.emit('player-update', {
      socketId: socketId,
      novoState: game.players[socketId],
    });
  });
  socket.on('chute', (vectorX, vectorY)=>{
    game.balls['ball'] = game.chute(vectorX, vectorY);
  });
  setInterval(game.movingBall, 100);
});

http.listen(3000, ()=>{
  console.log('hosting on *:3000');
});

/**
 * Cria o jogo
 * @return {game} retorna o jogo
 */
function createGame() {
  const game = {
    canvasWidth: 400,
    canvasHeight: 400,
    players: {},
    balls: {},
    gol: {},
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
    return game.players[socketId] = {
      name: name,
      x: 100,
      y: 100,
      team: team,
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
    player = game.players[socketId];
    player.y = player.y + directionY;
    player.x = player.x + directionX;
    /* if (direction == 'up' && player.y - 4 >= 0) {
      player.y = player.y - 4;
    }
    if (direction == 'left' && player.x - 4 >= 0) {
      player.x = player.x - 4;
    }
    if (direction == 'down' && player.y + 4 <= game.canvasHeight) {
      player.y = player.y + 4;
    }
    if (direction == 'right' && player.x + 4 <= game.canvasWidth) {
      player.x = player.x + 4;
    } */
    return player;
  }
  /**
   * @param {String} socketId
   */
  function removePlayer(socketId) {
    delete game.players[socketId];
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @return {any} ball
   */
  function addBall(x, y) {
    return game.balls['ball'] = {
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
    ball = game.balls['ball'];
    ball.speedX += vectorX;
    ball.speedY += vectorY;
    return ball;
  }

  /**
   * @return {any} ball
   */
  function movingBall() {
    ball = game.balls['ball'];

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    ball.speedX = 0;
    ball.speedY = 0;
    game.balls['ball'] = ball;

    io.emit('update-ball', game.balls['ball']);
    return ball;
  }

  return game;
}
