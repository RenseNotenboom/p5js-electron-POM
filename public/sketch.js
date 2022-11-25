let knipperMode, engineMode, lightMode;



function preload(){
  //loading all sounds here
  START_START = loadSound('Sounds/START_01_START.wav');
  START_LOOP = loadSound('Sounds/START_01_LOOP.wav');
  START_STOP = loadSound('Sounds/START_01_STOP.wav');
  //START_ENGINE =
}
function setup() {

  console.log("POM V.01");
  createCanvas(windowWidth, windowHeight);
  //setting up OSC
  setupOsc(1200, 3334);
  noStroke()
  background(255)
}

function draw() {
  onEngine();
	background(0, 0, 255);
	fill(0, 255, 0);
	fill(0);

}
//what to do when someone toggles the engine switch on.
function onEngine(){
  if (engineMode == 1 && START_01_START.isPlaying() == false){
    START_01_START.play();
    engineMode =2;
  }
 if(engineMode ==2 && START_01_START.isPlaying() == false && START_01_LOOP.isPlaying() == false ){
 START_LOOP.play();

}
if(engineMode == 4 ){
  console.log("PRESSED STOP");
  START_STOP.play();
  START_LOOP.stop();
  engineMode=0;
}
}
//listening to all values and assigning them here
function receiveOsc(address, value) {
	console.log("received OSC: " + address + ", " + value);

	if (address == '/knipperMode') {
    
		knipperMode = value;
	}
  if (address == '/lightMode') {
    
		lightMode = value;
	}
  if (address == '/engineMode') {
		engineMode = value;
	}
}

//OSC STUFF
function sendOsc(address, value) {
	socket.emit('message', [address].concat(value));
}
//CHANGE IP AT OSCPORTIN/OUT
function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {
   
			server: { port: oscPortIn,  host: '192.168.1.151'},
			client: { port: oscPortOut, host: '192.168.1.151'}
		});
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}


function mousePressed() {

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}





