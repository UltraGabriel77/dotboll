/* eslint-disable max-len */
/* eslint-disable prefer-rest-params */

/* eslint-disable require-jsdoc */
const socket = io();
const times1 = document.getElementById('timelist1');
const times2 = document.getElementById('timelist2');
const canvas = document.getElementById('game');

// Alterar o nome e o time
$('#time1').click(function(e) {
  console.log('vermelho');
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
  canvas.width = game.canvasWidth;
  canvas.height = game.canvasHeight;

  const context = canvas.getContext('2d');
  console.log('aaaaa');
  updateTeam();

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

    const ball = game.balls['ball'];
    context.fillStyle = '#00ff00';
    context.globalAlpha = 0.7;
    context.fillRect(ball.x-5, ball.y-5, 10, 10);
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


  const keys = [];

  addEventListener('keydown', (e) => {
    if (keys.indexOf(e.key) == -1) {
      console.log(e.key);
      keys.push(e.key);
    }
  });

  addEventListener('keyup', (e) => {
    if (keys.indexOf(e.key) != undefined) {
      delete keys[keys.indexOf(e.key)];
    }
  });

  function checkKeyboard() {
    const plr = game.players[socket.id];
    let distance;
    let a;
    let b;
    let directionX = 0;
    let directionY = 0;
    if (plr != undefined) {
      const ball = game.balls['ball'];
      a = plr.x - ball.x;
      b = plr.y - ball.y;

      distance = Math.sqrt( a*a + b*b );
    }
    if (plr != undefined) {
      if (keys.indexOf(String(' ')) != -1 && distance <= 30 ) {
        let vectorX;
        let vectorY;
        if (a>=0) {
          vectorX = -4;
        } else {
          vectorX = 4;
        }
        if (b>=0) {
          vectorY = -4;
        } else {
          vectorY = 4;
        }
        socket.emit('chute', vectorX, vectorY);
        return;
      }
      if (keys.indexOf('ArrowRight') != -1 && plr.x + 4 < game.canvasWidth) {
        directionX += 4;
      }
      if (keys.indexOf('ArrowUp') != -1 && plr.y - 4 >= 0) {
        directionY -= 4;
      }
      if (keys.indexOf('ArrowLeft') != -1 && plr.x - 4 >= 0) {
        directionX -= 4;
      }
      if (keys.indexOf('ArrowDown') != -1 && plr.y + 4 < game.canvasHeight) {
        directionY += 4;
      }
      if (directionX != 0 || directionY != 0) {
        socket.emit('move-player', socket.id, directionX, directionY);
        plr.y = plr.y + directionY;
        plr.x = plr.x + directionX;
        game.players[socket.id] = plr;
      }
    }
  }

  setInterval(checkKeyboard, 30);
});

// Atualizar jogadores:
socket.on('new-player', (player) => {
  game.players[player.socketId] = player.novoState;
  updateTeam();
});
socket.on('player-update', (player) => {
  console.log(player);
  game.players[player.socketId] = player.novoState;
});

socket.on('update-ball', (ball)=>{
  game.balls['ball'] = ball;
});

socket.on('score-update', (score)=>{
  game.score = score;
  $('#score-red').text(game.score.red);
  $('#score-blue').text(game.score.blue);
});

socket.on('disconnect', (player)=>{
  console.log(player);
  delete game.players[player.socketId];
  $('#'+player.socketId).remove();
  updateTeam();
});


function updateTeam() {
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
  times1.innerHTML = lista1;
  times2.innerHTML = lista2;
}

