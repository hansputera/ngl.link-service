import type {IncomingMessage} from 'http';
import type {WebSocket} from 'ws';
import {validateAuth} from '../services/validate-auth';

// Close codes ref: https://www.iana.org/assignments/websocket/websocket.xhtml

type AuthPayload = {
	token: string;
	id: string;
};

export const handleConnection = async (
	socket: WebSocket,
// eslint-disable-next-line no-async-promise-executor
): Promise<boolean> => new Promise(async resolve => {
	const disconnectTimeout = setTimeout(() => {
		socket.close(1013, 'Try again later!');
		resolve(false);
	}, 30_000);

	socket.send(JSON.stringify({message: 'Please send auth payload in 30 secs'}));
	socket.on('message', async (data, isBinary) => {
		if (isBinary) {
			socket.close(1003, 'Unsupported data!');
			resolve(false);
		} else {
			try {
				// eslint-disable-next-line @typescript-eslint/no-base-to-string
				const payload = JSON.parse(data.toString('utf8')) as AuthPayload;
				if (!payload.id?.length || !payload.token?.length) {
					socket.send(JSON.stringify({message: '[MissingError]: Incorrect auth payload'}));
				}

				if (await validateAuth(payload.token, payload.id)) {
					clearTimeout(disconnectTimeout);
					socket.send(JSON.stringify({message: '[Success]: Auth success'}));
					resolve(true);
				} else {
					socket.send(JSON.stringify({message: '[InvalidError]: Auth fail'}));
				}
			} catch {
				socket.send(JSON.stringify({message: '[ParseError]: Incorrect auth payload'}));
			}
		}
	});
});
