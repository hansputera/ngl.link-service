import type {IncomingMessage} from 'http';
import type {WebSocket} from 'ws';
import {validateAuth} from '../services/validate-auth';

export const handleConnection = async (
	socket: WebSocket,
	request: IncomingMessage,
) => {
	// 1.1 Authentication
	const token = request.headers['x-token']?.toString();
	const id = request.headers['x-id']?.toString();

	if (!token?.length || !id?.length) {
		socket.close(1, 'Auth required');
		return;
	}

	if (!(await validateAuth(token, id))) {
		socket.close(1, 'Auth failed');
		return;
	}

	socket.send({message: 'Auth success!'});
};
