// p5 init stuff
/*
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
//				-=- Sketch -=-			   //
//										   //
// doc string thing						   //
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
*/

// Globals and Constants //
var game;
var params;

function setup () {
	// Create Canvas //
	var myCanvas = createCanvas(800, 600);
	myCanvas.parent('game-container');
	// Init //
	params = getURLParams();
	game = new Game(params);
	game.init();
	// Load? //
}
function draw () {
	game.update();
	game.draw();
}


/*
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= //
//				-=- Game -=-				//
//											//
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=	//
*/

Game.prototype._states = {
	init:'logo',
	logo:{
		logos:['erebyte','title'],
		current:0,
		frame:0,
		FSM:new SimpleFSM({_states:{
			init:'erebyte',
			erebyte:{Execute:function(){}},
			title:{Execute:function(){}}
		}}),
		Execute:function(){
			// this.data.FSM.Execute();
			push();
			background(30);
			noStroke();
			fill(100);
			textFont("Georgia");
			textSize(20);
			var title = this.data.logos[this.data.current];
			text(title+"_frame_"+this.data.frame, 20, 20);
			pop();
			//
			if(this.data.frame==50){
				if(this.data.logos[this.data.current+1]){
					this.data.FSM.setState(this.data.logos[++this.data.current]);
					this.data.frame = 0;
				}else{
					this.FSM.setState('menu');
				}
			}
			this.data.frame++;
		}
	},
	menu:{
		// Enter:function(){},
		Execute:function(){
			background(50);
			// display text
			push();
			noStroke();
			fill(100);
			textAlign(CENTER);
			textFont("Georgia");
			textSize(80);
			text("Test!", width/2, height/4);
			textSize(40);
			text('Click to start', width/2, height/2);
			textSize(12);
			text(VERSION, width*0.9, height*0.95);
			pop();
			// console.log('menu');
			// this.FSM.setState('game');
		},
		KeyPressed:function(state, data){
			if(data.type=='Mouse')state.FSM.setState('game');
		}
	},
	game:{
		Enter:function(args){
			//
			if(args){
				//set player atribs
				if(args.color)player.color = args.color;
				if(args.gender)player.attribs.gender = args.gender;
			}
			//terrain._changeMap(terrain.loadMap('test'));
		},
		Execute:function(){
			// -=- Draw -=- //
			background(100);
			//
			entities.update();
			ambience.update();
			terrain.update();
			//windows.update();
			camera.update();
			//
			push();
			camera.apply_transition();
			terrain.draw();
			entities.draw();
			pop();
			ambience.drawLight();
			//windows.draw();
			//
			game.debug();
		},
		KeyPressed:function(state, data){
			if(windows.open_window){
				windows.keyPressed(data);
			}else{
				player.keyPressed(data);
				if(data.type=='Key'){
					console.log(data.key);
					//if(data.key=='E') windows.newMenu();
					if(data.key=='1') game.toggleDebug();
					if(data.key=='2') sound.toggleDebug();
					//if(data.key==' ') entities.refresh();
				}
			}
		}
	}
};
Game.prototype._quickload = function(){
	this.setGamestate('game');
}


// Import test
console.log('Loaded sketch.js');
//
console.log('starting p5js');
new p5();
