var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

//Socket configuration
var dir = "http://localhost:4242";
var socket = io.connect(dir);
socket.on('connect',function (){
	socket.id = socket.socket.id;
});

//Keyboard
var keys = [];
window.addEventListener('keydown',function (e){
	keys[e.keyCode] = true;
},false);
 window.addEventListener('keyup',function (e){
 	keys[e.keyCode] = false;
 },false);

 