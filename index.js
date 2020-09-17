const {Player} = require('./public/Player');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const jogadores = {};

app.get('/', (req, res)=>{
  res.sendFile(__dirname + '/index.html');
});
app.get('/Player.js', (req, res)=>{
  res.sendFile(__dirname + '/public/Player.js');
});

io.on('connection', (socket)=>{
  const player = newPlayer(100, 100, socket.id); // Cria um novo jogador
  Object.values(jogadores).forEach((e) => {
    // Coloca os outros jogadoresna lista de times
    if (e.time!=0) {
      socket.emit('time', e);
    }
  });
  console.log('User conected: ' + player.id);
  socket.on('disconnect', () => {
    console.log('user disconnected: '+ socket.id);
    io.emit('disconnect', jogadores[socket.id]);
  });
  socket.on('time', (e)=>{
    console.log(e);
    jogadores[e[1]].time = e[0];
    io.emit('reload', jogadores[e[1]]);
  });
  socket.on('name', (e)=>{
    console.log(e);
    jogadores[e[0]].name = e[1];
    io.emit('reload', jogadores[e[1]]);
  });
});

http.listen(3001, ()=>{
  console.log('hosting on *:3001');
});

/**
 * Cria um novo jogador
 * @param {number} x posição x
 * @param {number} y posição y
 * @param {String} id id do jogador
 * @return {Player} Retorna o novo Player
 */
function newPlayer(x, y, id) {
  const player = new Player(x, y, id);
  jogadores[id] = player;
  return player;
}

