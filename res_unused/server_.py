#!/usr/bin/python

'''
Starting point

- simple redirect to add index and .html where nessary
'''

#-# Imports #-#
from sys import stdout as sys_stdout
from os import chdir as os_chdir
from os import curdir, sep
from threading import Thread
import SimpleHTTPServer
import BaseHTTPServer
import SocketServer
import logging

DEBUG = True

#-# Globals and Constants #-#
# logging.basicConfig(stream=sys_stdout, filename='bin/log.log', filemode='w', level=logging.DEBUG)
# LOG = logging.getLogger('root')

# Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
class Handler(BaseHTTPServer.BaseHTTPRequestHandler):
	def redirect_(self, path):
		self.send_response(301)
		self.send_header("Location", path)
		self.end_headers()
	def do_GET(self):
		if DEBUG: print 'do_GET.path:', self.path
		if self.path.endswith('/'):
			self.redirect_(self.path+'index.html')
		elif '?' in self.path and not '.' in self.path.split('?')[0]:
			self.redirect_(self.path.replace('?','.html?'))
		elif not self.path.endswith('.html') and not '?' in self.path and not '.' in self.path:
			self.redirect_(self.path+'.html')
		else:
			try:
				#Check the file extension required and
				#set the right mime type
				path = self.path.split('?')[0]

				sendReply = False
				if path.endswith(".html"):
					mimetype='text/html'
					sendReply = True
				if path.endswith(".jpg"):
					mimetype='image/jpg'
					sendReply = True
				if path.endswith(".gif"):
					mimetype='image/gif'
					sendReply = True
				if path.endswith(".png"):
					mimetype='image/png'
					sendReply = True
				if path.endswith(".js"):
					mimetype='application/javascript'
					sendReply = True
				if path.endswith(".css"):
					mimetype='text/css'
					sendReply = True
				if path.endswith(".json"):
					mimetype='text/json'
					sendReply = True

				if sendReply == True:
					#Open the static file requested and send it
					f = open(curdir + sep + path) 
					self.send_response(200)
					self.send_header('Content-type',mimetype)
					self.end_headers()
					self.wfile.write(f.read())
					f.close()
				return


			except IOError:
				self.send_error(404,'File Not Found: %s' % self.path)
		



server = SocketServer.TCPServer(('0.0.0.0', 8080), Handler)

#-# Functions and Classes #-#

def init():
	t = Thread(target=init_t)
	t.daemon = True
	t.start()

def init_t():
	sa = server.socket.getsockname()
	msg = str(sa[0])+" : "+str(sa[1])
	logging.getLogger('root.www').info(msg)
	print 'hosted on: '+msg
	server.serve_forever()


#-# Main#-#
def main():
	init()
	# LOG.info('Done Initializing')
	usr_in = raw_input()
	while not (usr_in == "kill"):
		# if usr_in.split()[0] == "cd":
		# 	dir_ = usr_in.split()
		# 	dir_.append("")
		# 	dir_ = dir_[1]
		# 	print "changing directory to:", dir_
		# 	os_chdir(dir_)
		usr_in = raw_input()
	server.server_close()
	server.shutdown()
	server.socket.close()
	# Handler.
	# LOG.info('Killing server done.')


if __name__ == '__main__':
	main()