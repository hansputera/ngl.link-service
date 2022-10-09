import 'dotenv/config';
import * as ws from 'ws';
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
	const addr = server.address();
	console.log(
		'NotificationServer listening to',
		typeof addr === 'string' ? addr : addr.address.concat(
			':', addr.port.toString(),
		),
	);
});
