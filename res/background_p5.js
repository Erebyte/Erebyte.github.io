var canvas;
var graphic;
var graphic2;
var graphic3;

var drones;

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	graphic.resizeCanvas(windowWidth, windowHeight);
	graphic2.resizeCanvas(windowWidth, windowHeight);
	graphic3.resizeCanvas(windowWidth, windowHeight);
	graphic4.resizeCanvas(windowWidth, windowHeight);
}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	graphic = createGraphics(windowWidth, windowHeight);
	graphic2 = createGraphics(windowWidth, windowHeight);
	graphic3 = createGraphics(windowWidth, windowHeight);
	graphic4 = createGraphics(windowWidth, windowHeight);
	drones = [];
}

function draw() {
	//background(20);
	clear();

	xOffset = 0.3;
	yOffset = 0.5;

	graphic3.clear()

	graphic.loadPixels();
	graphic2.loadPixels();
	for (let y = 0; y < graphic.height; y++) {
		for (let x = 0; x < graphic.width; x++) {
					index = 4 * (y * width + x);
					//graphic.pixels[index] = r;
					//graphic.pixels[index+1] = g;
					//graphic.pixels[index+2] = b;
					graphic.pixels[index+3] -= 1;
					graphic2.pixels[index+3] -= 2;
			//	}
			//}
		}
	}
	graphic.updatePixels();
	graphic2.updatePixels();

	image(graphic2, 0,0, width, height);
	image(graphic, 0,0, width, height);
	image(graphic3, 0,0, width, height);

	graphic.push()
	graphic2.push()
	graphic3.push()

	graphic.translate(graphic.width*xOffset, graphic.height*yOffset)
	graphic2.translate(graphic2.width*xOffset, graphic2.height*yOffset)
	graphic3.translate(graphic3.width*xOffset, graphic3.height*yOffset)

	for (var i = drones.length - 1; i >= 0; i--) {
		drones[i].update();
		drones[i].draw();
		drones[i].drawShadow();
		drones[i].drawGlow();
	}

	graphic.pop()
	graphic2.pop()
	graphic3.pop()

	if(random(100)<5) drones.push(new Drone());
}

// functions //

// classes //

function Drone () {
	this.size = 6;
	this.shadowSize = 3
	this.glowSize = 10
	this.life = random(20,40);
	this.cols=[
		{r:random(150,200),g:random(100),b:random(150,200)},
		{r:random(100),g:random(150,200),b:random(100)},
		{r:random(100),g:random(100),b:random(150,200)},
		{r:random(200),g:random(200),b:random(200)}
	]
	this.col = random(this.cols);

	this.pos = createVector();
	this.dir = p5.Vector.random2D();
	this.dir.setMag(random(3,15)*0.02+0.2);
}
Drone.prototype.update = function () {
	//
	this.pos.add(this.dir);
	this.life-=0.05;

	if(this.life <= 0) drones.splice(drones.indexOf(this), 1);

	if(random(100)<10) this.dir.rotate(PI*0.01);
	if(random(100)<0.05) this.dir.rotate(-PI*0.05);

}
Drone.prototype.draw = function () {
	//
	graphic3.noStroke();
	graphic3.fill(this.col.r,this.col.g,this.col.b,150);
	graphic3.ellipse(this.pos.x, this.pos.y, this.size, this.size)
	graphic3.fill(this.col.r+50,this.col.g+50,this.col.b+50,150);
	graphic3.ellipse(this.pos.x, this.pos.y, this.size-3, this.size-3)
}
Drone.prototype.drawShadow = function () {
	graphic.push();
	graphic.noStroke();
	graphic.fill(this.col.r,this.col.g,this.col.b,100);
	graphic.ellipse(this.pos.x, this.pos.y, this.shadowSize, this.shadowSize)
	graphic.fill(this.col.r+70,this.col.g+70,this.col.b+70,150);
	graphic.ellipse(this.pos.x, this.pos.y, 2, 2)
	graphic.pop();
}
Drone.prototype.drawGlow = function () {
	graphic2.push();
	graphic2.noStroke();
	graphic2.fill(this.col.r,this.col.g,this.col.b,10);
	graphic2.ellipse(this.pos.x, this.pos.y, this.glowSize, this.glowSize)
	graphic2.pop();
}
