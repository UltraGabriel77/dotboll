const { Player } = require("./Player");

var app = require("express")();
var http = require("http").createServer(app);
var io = require('socket.io')(http);

var jogadores = {};

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

io.on('connection',(socket)=>{
    var player = newPlayer(100,100,socket.id)   //Cria um novo jogador
    Object.values(jogadores).forEach(e => {     //Coloca os outros jogadoresna lista de times
        if (e.time!=0){
            socket.emit('time', e);
        }
    });                                     
    console.log("User conected: " + player.id);
    socket.on('disconnect', () => {
        console.log('user disconnected: '+ socket.id);
        io.emit('disconnect',jogadores[socket.id])
    });
    socket.on('time',(e)=>{
        console.log(e);
        jogadores[e[1]].time = e[0];
        io.emit('reload',jogadores[e[1]]);
    });
    socket.on('name',(e)=>{
        console.log(e);
        jogadores[e[0]].name = e[1];
        io.emit('reload',jogadores[e[1]]);
    });

});

http.listen(3000, ()=>{
    console.log('hosting on *:3000');
});

function newPlayer(x,y,id) {
    var player = new Player(x,y,id);
    jogadores[id] = player;
    return player;
}

