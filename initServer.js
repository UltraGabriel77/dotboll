const { createWorld } = require("./createWorld");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 3000;
/**
 * Iniciar o server e pegar os eventos
 */
function initServer() {
  console.log("> Iniciando o server");

  app.use(express.static(`${__dirname}/static`));
  const game = createWorld(400, 400, io);
  game.addBall(200, 200);

  io.on("connection", (socket) => {
    playerConnection(socket);
  });

  host();

  function playerConnection(socket) {
    console.log("> User conected: " + socket.id);
    socket.emit("boostrap", game);
    io.emit("score-update", game.score);
    socket.on("disconnect", () => {
      playerDisconnect(socket);
    });
    socket.on("set-team", (socketId, team, name) => {
      changePlayerTeam(socketId, team, name);
    });
    socket.on("move-player", (socketId, directionX, directionY) => {
      movePlayer(socketId, directionX, directionY, socket);
    });
    socket.on("chute", (vectorX, vectorY) => {
      game.balls["ball"] = game.chute(vectorX, vectorY);
    });
    socket.on("ball-to", (vectorX, vectorY) => {
      const ball = game.balls["ball"];
      ball.x = vectorX;
      ball.y = vectorY;
    });
    socket.on("begin", () => {
      let game = createWorld(400, 400);
      socket.emit("boostrap", game);
    });
    setInterval(() => {
      game.movingBall();
      io.emit("update-ball", game.balls["ball"]);
    }, 100);
  }

  function movePlayer(socketId, directionX, directionY, socket) {
    const player = game.movePlayer(socketId, directionX, directionY);
    socket.broadcast.emit("player-update", {
      socketId: socketId,
      novoState: player
    });
  }

  /**
   * Muda o time
   */
  function changePlayerTeam(socketId, team, name) {
    const player = game.addPlayer(socketId, team, name);
    console.log(player.name + " entrou para o time " + team);
    player.team = team;
    io.emit("new-player", {
      socketId: socketId,
      novoState: player
    });
  }

  function playerDisconnect(socket) {
    console.log("> user disconnected: " + socket.id);
    game.removePlayer(socket.id);
    io.emit("disconnect", game);
  }

  /**
   * Faz o hosting do server
   */
  function host() {
    http.listen(PORT, () => {
      console.log("> hosting on localhost:3000");
    });
  }
}
exports.initServer = initServer;
