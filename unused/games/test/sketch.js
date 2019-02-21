function setup () {
	// body...
	var myCanvas = createCanvas(800, 600);
	myCanvas.parent('game-container');
}

function draw () {
	background(100);
	testDraw();
}

// Import test
console.log('Loaded sketch.js');
//
console.log('starting p5js');
new p5();
