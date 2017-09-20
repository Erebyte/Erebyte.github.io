function Chat() {

	this.init = function () {
		var self = this;
		after(2000, function(){
			self.alert('"?" has joined');
			after(2000, function(){
				self.message_add('Hello there', '?');
			});
		});
	};

	this.submit = function () {
		var msg = document.forms['input']['textbox'].value;
		if (msg !== '') {
			document.forms['input']['textbox'].value = '';
			this.message_add(msg, 'user');
			game.message_submit(msg);
		}
	};

	// messages //

	this.alert = function (msg) {
		this.message_add(msg, null, 'alert');
	};

	this.message_add = function (msg, usr, typ) {
		msg = msg.split('\n').join('<br/>');

		if (usr == '?') {
			document.getElementById('msg_tone').play();
		}
		
		typ = typ || 'msg';
		var msgs = document.getElementById('messages');
		var p = document.createElement('p');
		p.className = typ;
		p.innerHTML = msg;
		p.setAttribute('user', usr);
		msgs.appendChild(p);

	};
}