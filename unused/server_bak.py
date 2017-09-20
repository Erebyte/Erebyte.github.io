#!/usr/bin/python

'''
Starting point
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

from imp import load_source

#-# Globals and Constants #-#
try:
	logging.basicConfig(stream=sys_stdout, filename='bin/log.log', filemode='w', level=logging.DEBUG)
except IOError as e:
	print e
LOG = logging.getLogger('root')
Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

class HandlerClass(Handler):
	"""docstring for Handler"""
	def _set_headers(self):
		self.send_response(200)
		self.send_header('Content-type', 'text/html')
		self.end_headers()

	def redirect_(self, path):
		self.send_response(301)
		self.send_header("Location", path)
		self.end_headers()

	def do_GET(self):
		LOG.info('do_GET.path: %s' % (self.path))
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
				else:
					LOG.info('GET - No reply sent for path: %s' % (path))
				return
			except IOError:
				LOG.info('GET - No reply sent for path: %s' % (path))
				self.send_error(404,'File Not Found: %s' % self.path)

	def do_POST(self):
		LOG.info('Got Post!!! Path:%s' % (self.path))
		# LOG.info('Body:%s' % (post_body))
		content_len = int(self.headers.getheader('content-length', 0))
		post_body = self.rfile.read(content_len)

		resp = ''
		try:
			handle = load_source('handle', '.'+self.path)
			resp = handle.handle(post_body, self.path)
		except Exception, e:
			print 'Handle error:', e

		if(resp == '' or not resp):
			resp = 'empty response'
			LOG.info('POST - No response sent for path: %s' % (self.path))
		self._set_headers()
		self.wfile.write(resp)


server = SocketServer.TCPServer(('0.0.0.0', 8080), HandlerClass)

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
	print 'windows? : 127.0.0.1'
	server.serve_forever()


#-# Main#-#
def main():
	init()
	LOG.info('Done Initializing')
	usr_in = raw_input()
	while not (usr_in == "kill"):
		usr_in = raw_input()
		LOG.info('Console Input: '+usr_in)
	LOG.info('Killing server done.')


if __name__ == '__main__':
	main()