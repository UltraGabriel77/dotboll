/* eslint-disable prefer-rest-params */
/* eslint-disable require-jsdoc */
const socket = io();
const times = document.getElementById('lista-de-times');
const canvas = document.getElementById('game');

// Alterar o nome e o time
$('#time1').click(function(e) {
  e.preventDefault();
  socket.emit('set-team', socket.id, 'red', $('#name-getter').val());
  return false;
});
$('#time2').click(function(e) {
  e.preventDefault();
  socket.emit('set-team', socket.id, 'blue', $('#name-getter').val());
  return false;
});

socket.on('boostrap', (gameInitialState)=>{
  game = gameInitialState;

  const context = canvas.getContext('2d');
  console.log('aaaaa');

  requestAnimationFrame(draw);

  /**
  * Desenha a tela
  */
  function draw() {
    // eslint-disable-next-line no-unused-vars
    const allPixels = game.canvasWidth * game.canvasHeight;

    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.fillRect(0, 0, game.canvasWidth, game.canvasHeight);
    // eslint-disable-next-line guard-for-in
    for (const socketId in game.players) {
      const player = game.players[socketId];
      if (player != undefined) {
        if (player.team == 'red') {
          context.fillStyle = '#ff0000';
        }
        if (player.team == 'blue') {
          context.fillStyle = '#0000ff';
        }
        context.globalAlpha = 0.4;
        context.fillRect(player.x-5, player.y-5, 10, 10);
      }
    }
    requestAnimationFrame(draw);
  }
});

// Atualizar jogadores:
socket.on('new-player', (player) => {
  game.players[player.socketId] = player.novoState;
  lista1 = ``;
  lista2 = ``;
  // eslint-disable-next-line guard-for-in
  for (const socketId in game.players) {
    console.log(game.players);
    const element = game.players[socketId];
    const team = game.players[socketId].team;
    console.log(team);
    if (team == 'red') {
      console.log(element);
      lista1 += `<li>${element.name}</li>`;
    }
    if (team == 'blue') {
      console.log(element);
      lista2 += `<li>${element.name}</li>`;
    }
  }
  lista = `
    <h4>Time 1: </h4>
    <ul id="timelist1"></ul>
    ${lista1}
    <button id="time1">Entrar</button>
    <h4>Time 2: </h4>
    ${lista2}
    <ul id="timelist2"></ul>
    <button id="time2">Entrar</button>
  `;
  times.innerHTML = lista;
});
socket.on('player-update', (player) => {
  console.log(player);
  game.players[player.socketId] = player.novoState;
});

socket.on('disconnect', (player)=>{
  if (player != null) {
    delete game.players[player.socketId];
  }
  $('#'+player.socketId).remove();
});

function handleKeydown(event) {
  const player = game.players[socket.id];

  if (player!=undefined) {
    if (event.which === 37 && player.x - 1 >= 0) {
      player.x = player.x - 1;
      socket.emit('move-player', socket.id, 'left');
      return;
    }

    if (event.which === 38 && player.y - 1 >= 0) {
      player.y = player.y - 1;
      socket.emit('move-player', socket.id, 'up');
      return;
    }

    if (event.which === 39 && player.x + 1 < game.canvasWidth) {
      player.x = player.x + 1;
      socket.emit('move-player', socket.id, 'right');
      return;
    }
    if (event.which === 40 && player.y + 1 < game.canvasHeight) {
      player.y = player.y + 1;
      socket.emit('move-player', socket.id, 'down');
      return;
    }
  }
}


document.addEventListener('keydown', handleKeydown);

