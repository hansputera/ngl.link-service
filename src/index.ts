import 'dotenv/config';
import * as ws from 'ws';
import {handleConnection} from './controllers/handle-connection';
import {portWebsocket} from './env';
import {redisClient} from './redis';

const server = new ws.WebSocketServer({
	port: portWebsocket,
	host: '0.0.0.0',
});

const clients = new Map<string, ws.WebSocket>();

redisClient.subscribe('new_message', async (err, data) => {
	if (err) {
		console.error('redisClient.subscribe: an error occured', err.message);
	}

	if (data === 1) {
		console.log('Connected to new_message redis channel!');
	} else {
		console.log(data);
	}
}).then(() => undefined).catch(() => undefined);

server.on('error', err => {
	console.log(err);
}).on('connection', async socket => {
	socket.on('close', () => {
		const data = [...clients.entries()].find(c => c[1] === socket);
		if (data) {
			clients.delete(data[0]);
		}
	});
	const payloadSocket = await handleConnection(socket);
	if (payloadSocket) {
		if (clients.has(payloadSocket.id)) {
			clients.get(payloadSocket.id)!.close(1001, 'Another session is being connected');
		}

		clients.set(payloadSocket.id, socket);
	}
}).on('listening', async () => {
	const addr = server.address();
	console.log(
		'NotificationServer listening to',
		typeof addr === 'string' ? addr : addr.address.concat(
			':', addr.port.toString(),
		),
	);
});
