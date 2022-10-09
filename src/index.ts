import 'dotenv/config';
import path from 'path';
import * as ws from 'ws';
import {handleConnection} from './controllers/handle-connection';
import {portWebsocket} from './env';
import {redisClient} from './redis';
import {MessagesStore} from './services/messages-store';
import type {MessagePayload} from './typings';

const server = new ws.WebSocketServer({
	port: portWebsocket,
	host: '0.0.0.0',
});
const clients = new Map<string, ws.WebSocket>();
const messagesStore = new MessagesStore(path.resolve('messages'));

redisClient.subscribe('new_message', async (err, data) => {
	if (err) {
		console.error('redisClient.subscribe: an error occured', err.message);
	}

	if (data) {
		console.log('Subscribed to new_message channel');
	}
}).then(() => undefined).catch(() => undefined);

redisClient.on('message', async (channel, message) => {
	if (channel === 'new_message') {
		try {
			const payload = JSON.parse(message) as MessagePayload;

			if (clients.has(payload.id)) {
				clients.get(payload.id)?.send(JSON.stringify({
					message: payload.msg,
					time: new Date(payload.time_now),
				}));
			} else {
				await messagesStore.store(payload.id, {
					message: payload.msg,
					time: parseInt(payload.time_now, 10),
				});
			}
		} catch {
			// Nothing
		}
	}
});

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

		const messages = await messagesStore.get(payloadSocket.id);
		socket.send(JSON.stringify({messages}));

		await messagesStore.delete(payloadSocket.id);
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
