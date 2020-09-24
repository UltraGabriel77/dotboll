const express = require('express');
const {World} = require('./World');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


const game = new World(400, 400);
app.use(express.static(`${__dirname}/static`));

io.on('connection', (socket)=>{
  console.log('> User conected: ' + socket.id);
  socket.emit('boostrap', game);
  io.emit('score-update', game.score);
  socket.on('disconnect', () => {
    console.log('> user disconnected: '+ socket.id);
    game.removePlayer(socket.id);
    io.emit('disconnect', game);
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
    game.players[socketId] = game.movePlayer(socketId, directionX, directionY);
    socket.broadcast.emit('player-update', {
      socketId: socketId,
      novoState: game.players[socketId],
    });
  });
  socket.on('chute', (vectorX, vectorY)=>{
    game.balls['ball'] = game.chute(vectorX, vectorY);
  });
  socket.on('ball-to', (vectorX, vectorY)=>{
    ball = game.balls['ball'];
    ball.x = vectorX;
    ball.y = vectorY;
  });
  socket.on('begin', ()=>{
    game = new World(400, 400);
    socket.emit('boostrap', game);
  });
  game.on('score-update', (score)=>{
    io.emit('score-update', score);
  });
  setInterval(()=>{
    game.movingBall();
    io.emit('update-ball', game.balls['ball']);
  }, 100);
});

http.listen(3000, ()=>{
  console.log('> hosting on localhost:3000');
});
