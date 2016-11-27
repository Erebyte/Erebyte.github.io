
// functions

function after(ms, callback) {
  setTimeout(callback, ms);
}

// classes

function Parser () {

	//init


	this.parse = function (msg) {
		console.log('parsing', msg);

		if (msg == 'hello') {
			after(4000, function(){
				game.chat.message_add('hmmmmmm....', '?');
			});
		}else if (msg.replace('?','') == 'what is this') {
			after(100, function(){
				var user_name = 'Game_Dev' + Math.floor(Math.random()*100).toString();
				game.chat.alert('"'+user_name+'" has joined');
				game.chat.message_add('This is a game that emulates a chat engine. This is a pre-alpha sneak peek and is limited sorry.\n\n(n_n)/', user_name);
				game.chat.alert('"'+user_name+'" has left');
			});
		}
	};
}

//game

function Game() {
	this.gamestate = 'init';
	this.flags = {
	};
	this.chat = new Chat(game);
	this.parser = new Parser();

	this.init = function () {
		this.chat.init();
		var flags = {
			'?_waiting' : true,
			'?_typing' : false,
		};
		this.setFlag(flags);
		this.setGamestate('game');
	};

	this.message_submit = function (msg) {
		//msg.clean()
		var resp = this.parser.parse(msg);
	};

	//

	this.setGamestate = function (state) {
		this.gamestate = state;
	};

	this.setFlag = function (flag, value) {
		if (typeof flag == 'object') {
			for (var fl in flag) {
				this.setFlag(fl, flag[fl]);
			}
		}else {
			this.flags[flag] = value;
		}
	};
}