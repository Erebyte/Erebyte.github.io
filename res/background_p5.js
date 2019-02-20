// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
//
//
//
//
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //


// Globals and Constants //
var canvas;
var droneManager;

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}



// -=-=- p5.js functions -=-=- //
//

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	//
	var managerPos = createVector(200,250);
	var managerDim;
	var managerRealDim;
	//
	if(isMobile) {
		managerPos = createVector(20, 50);
		managerDim = createVector(300,300);
		managerRealDim = createVector(100,100);
	}
	droneManager = new DroneManager(managerPos, managerDim, managerRealDim);
}

function draw() {
	//background(20);
	clear();

	//update
	droneManager.update()

	//draw
	droneManager.draw()
}

// -=-=- Functions -=-=- //
//


// -=-=- Classes -=-=- //
//

function DroneManager (pos, dim, real_dim) {
	var dim_x = 400
	var dim_y = 400
	this.real_dim = real_dim || createVector(dim_x,dim_y);
	this.dim = dim ||createVector(dim_x,dim_y);
	this.pos = pos || createVector(width/2, height/2);
	this.pos.add(this.real_dim.copy().mult(-0.5))
	this.sclr = (this.dim.x/dim_x + this.dim.y/dim_y)/2
	if (isMobile) this.sclr *= 0.5;
	//
	this.graphic = createGraphics(this.real_dim.x,this.real_dim.y);
	this.buffer = createGraphics(this.real_dim.x,this.real_dim.y);
	//
	this.drones = [];
}
DroneManager.prototype.update = function () {
	
	// adding drones
	if(random(100)<3) this.drones.push(new Drone(this));

	// decrement the alpha of each pixel
	this.buffer.loadPixels();
	for (let i = 0; i*4 < this.buffer.pixels.length; i++) {
		this.buffer.pixels[i*4 + 3] -= 1; //index:(4*i) + rgba:[0-3]
	}
	this.buffer.updatePixels();

	// -=-=- Update Buffers -=-=- //
	//
	this.graphic.clear();
	//
	this.graphic.push();
	this.buffer.push();
	//
	if(isMobile){
		this.graphic.scale(0.5);	
		this.buffer.scale(0.5);	
	}
	this.graphic.translate(this.real_dim.x/2, this.real_dim.y/2);
	this.buffer.translate(this.real_dim.x/2, this.real_dim.y/2);
	this.graphic.scale(this.sclr);	
	this.buffer.scale(this.sclr);	

	
	// update each drone and draw to each buffer
	for (var i = this.drones.length - 1; i >= 0; i--) {
		this.drones[i].draw();
		this.drones[i].drawGlow();
		this.drones[i].update()
	}

	// draw effects 
	var sclr = noise(frameCount*0.01)+1;
	var sclr2 = noise(frameCount*0.1+1000)+1;
	var col = 200*sclr2;
	this.graphic.noStroke();
	this.graphic.fill(col,col,col,100);
	this.graphic.ellipse(0,0,5*sclr,5*sclr);
	this.graphic.fill(col+30,col+30,col+30,200);
	this.graphic.ellipse(0,0,3*sclr,3*sclr);

	this.graphic.pop();
	this.buffer.pop();
	//
	// -=-=- Done Buffers -=-=- //


}
DroneManager.prototype.draw = function () {
	push();
	image(this.buffer, this.pos.x, this.pos.y, this.dim.x, this.dim.y);
	image(this.graphic, this.pos.x, this.pos.y, this.dim.x, this.dim.y);
	pop();
}


// -=-=- Drone -=-=- //
function Drone (parent) {
	this.parent = parent;
	//
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
	this.dir.setMag(random(3,10)*0.02+0.01);
}
Drone.prototype.update = function () {
	//
	this.pos.add(this.dir);
	this.life-=0.05;

	if(this.life <= 0) {
		this.drawDeath();
		this.parent.drones.splice(this.parent.drones.indexOf(this), 1);
	}

	if(random(100)<10) this.dir.rotate(PI*0.01);
	if(random(100)<0.05) this.dir.rotate(-PI*0.05);

}
Drone.prototype.draw = function () {
	var graphic = this.parent.graphic;
	//
	graphic.noStroke();
	graphic.fill(this.col.r,this.col.g,this.col.b,150);
	graphic.ellipse(this.pos.x, this.pos.y, this.size, this.size)
	graphic.fill(this.col.r+50,this.col.g+50,this.col.b+50,150);
	graphic.ellipse(this.pos.x, this.pos.y, this.size-3, this.size-3)
}
Drone.prototype.drawGlow = function () {
	var graphic = this.parent.buffer;
	//
	graphic.push();
	graphic.noStroke();
	//
	graphic.fill(this.col.r,this.col.g,this.col.b,5);
	graphic.ellipse(this.pos.x, this.pos.y, this.glowSize, this.glowSize)
	//
	graphic.fill(this.col.r,this.col.g,this.col.b, 50);
	graphic.ellipse(this.pos.x, this.pos.y, this.shadowSize, this.shadowSize)
	graphic.fill(this.col.r+100,this.col.g+100,this.col.b+100, 60);
	graphic.ellipse(this.pos.x, this.pos.y, 2, 2)
	//
	graphic.pop();
}
Drone.prototype.drawDeath = function () {
	var graphic = this.parent.buffer;
	var sclr = random(0.0,1.0);
	//
	graphic.push();
	graphic.noStroke();
	//
	graphic.fill(this.col.r,this.col.g,this.col.b,50);
	graphic.ellipse(this.pos.x, this.pos.y, sclr*20, sclr*20)
	graphic.fill(this.col.r,this.col.g,this.col.b,100);
	graphic.ellipse(this.pos.x, this.pos.y, sclr*10, sclr*10)
	graphic.fill(this.col.r,this.col.g,this.col.b,150);
	graphic.ellipse(this.pos.x, this.pos.y, sclr*5, sclr*5)
	//
	graphic.pop();
}



