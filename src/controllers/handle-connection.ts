import type {IncomingMessage} from 'http';
import type {WebSocket} from 'ws';
import {validateAuth} from '../services/validate-auth';

// Close codes ref: https://www.iana.org/assignments/websocket/websocket.xhtml

export const handleConnection = async (
	socket: WebSocket,
	request: IncomingMessage,
): Promise<boolean> => {
	// 1.1 Authentication
	const token = request.headers['x-token']?.toString();
	const id = request.headers['x-id']?.toString();

	if (!token?.length || !id?.length) {
		socket.close(3000, 'Auth required');
		return false;
	}

	if (!(await validateAuth(token, id))) {
		socket.close(3000, 'Auth failed');
		return false;
	}

	socket.send({message: 'Auth success!'});
	return true;
};
