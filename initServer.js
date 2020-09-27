const {createWorld} = require('./createWorld');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

/**
 * Iniciar o server e pegar os eventos
 */
function initServer() {
  console.log('[initServer] > Iniciando o server');

  app.use(express.static(`${__dirname}/static`));
  const game = createWorld(600, 600, io);
  game.addBall(300, 300);

  io.on('connection', (socket) => {
    playerConnection(socket);
  });

  host();

  /**
   * Se conecta com o usuário
   * @param {any} socket
   */
  function playerConnection(socket) {
    console.log('[playerConnection] > User conected: ' + socket.id);
    socket.emit('boostrap', game);
    io.emit('score-update', game.score);

    socket.on('disconnect', () => {
      playerDisconnect(socket);
    });
    socket.on('set-team', (socketId, team, name) => {
      changePlayerTeam(socketId, team, name);
    });
    socket.on('move-player', (socketId, directionX, directionY) => {
      movePlayer(socketId, directionX, directionY, socket);
    });
    socket.on('chute', (vectorX, vectorY) => {
      game.balls['ball'] = game.chute(vectorX, vectorY);
    });
    socket.on('ball-to', (vectorX, vectorY) => {
      const ball = game.balls['ball'];
      ball.x = vectorX;
      ball.y = vectorY;
    });
    socket.on('begin', () => {
      game = createWorld(400, 400);
      socket.emit('boostrap', game);
    });
    setInterval(() => {
      game.movingBall();
      io.emit('update-ball', game.balls['ball']);
    }, 30);
  }

  /**
   * Mover o jogador
   * @param {String} socketId
   * @param {Number} directionX
   * @param {Number} directionY
   * @param {any} socket
   */
  function movePlayer(socketId, directionX, directionY, socket) {
    const player = game.movePlayer(socketId, directionX, directionY);
    socket.broadcast.emit('player-update', {
      socketId: socketId,
      novoState: player,
    });
  }

  /**
   * Muda o time
   * @param {String} socketId
   * @param {String} team
   * @param {String} name
   */
  function changePlayerTeam(socketId, team, name) {
    const player = game.addPlayer(socketId, team, name);
    console.log(
        '[changePlayerTeam] ' + player.name + ' entrou para o time ' + team,
    );
    player.team = team;
    io.emit('new-player', {
      socketId: socketId,
      novoState: player,
    });
  }

  /**
   * Desconecta o jogador
   * @param {any} socket
   */
  function playerDisconnect(socket) {
    console.log('[playerDisconnect] > user disconnected: ' + socket.id);
    game.removePlayer(socket.id);
    io.emit('disconnect', game);
  }

  /**
   * Faz o hosting do server
   */
  function host() {
    http.listen(PORT, () => {
      console.log('[host] > hosting on localhost:3000');
    });
  }
}
exports.initServer = initServer;
