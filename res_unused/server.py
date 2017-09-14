#!/usr/bin/python

'''
Starting point
'''

#-# Imports #-#
from sys import stdout as sys_stdout
from os import chdir as os_chdir
from threading import Thread
import SimpleHTTPServer
import SocketServer
import logging

from imp import load_source

#-# Globals and Constants #-#
logging.basicConfig(stream=sys_stdout, filename='bin/log.log', filemode='w', level=logging.DEBUG)
LOG = logging.getLogger('root')
Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

class HandlerClass(Handler):
	"""docstring for Handler"""
	def _set_headers(self):
		self.send_response(200)
		self.send_header('Content-type', 'text/html')
		self.end_headers()

	def do_POST(self):
		# print 'got post!!'
		# print self.path
		# print "post_body(%s)" % (post_body)
		content_len = int(self.headers.getheader('content-length', 0))
		post_body = self.rfile.read(content_len)

		resp = 'empty respopnse'
		try:
			handle = load_source('handle', '.'+self.path)
			resp = handle.handle(post_body, self.path)
		except Exception, e:
			print 'Handle error:', e

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
	server.serve_forever()


#-# Main#-#
def main():
	init()
	LOG.info('Done Initializing')
	usr_in = raw_input()
	while not (usr_in == "kill"):
		# if usr_in.split()[0] == "cd":
		# 	dir_ = usr_in.split()
		# 	dir_.append("")
		# 	dir_ = dir_[1]
		# 	print "changing directory to:", dir_
		# 	os_chdir(dir_)
		usr_in = raw_input()
	LOG.info('Killing server done.')


if __name__ == '__main__':
	main()