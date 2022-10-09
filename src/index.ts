import 'dotenv/config';
import ws from 'ws';
import {portWebsocket} from './env';

const server = new ws.WebSocketServer({
	port: portWebsocket,
	host: '0.0.0.0',
});

server.on('error', err => {
	console.log(err);
}).on('connection', socket => {
	socket.send('Hi!');
	socket.close();
}).on('listening', () => {
	console.log(server.address());
});
