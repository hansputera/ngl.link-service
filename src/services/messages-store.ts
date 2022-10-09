import * as fs from 'node:fs';
import * as path from 'node:path';
import type {MessageStorePayload} from '../typings';

/**
 * @class MessagesStore
 */
export class MessagesStore {
	constructor(private readonly directoryPath: string) {
		this.#init();
	}

	async cleanup(...activeIds: string[]): Promise<void> {
		const files = await fs.promises.readdir(this.directoryPath);

		await Promise.all(files.filter(fl => !activeIds.includes(fl.split('.')[0]) && fl.endsWith('.pack')).map(async fl => fs.promises.rm(
			path.resolve(this.directoryPath, fl),
		)));
	}

	async delete(id: string): Promise<boolean> {
		return fs.promises.rm(path.resolve(this.directoryPath, id.concat('.json')), {
			recursive: true,
		}).then(() => true).catch(() => false);
	}

	async get(id: string): Promise<MessageStorePayload[]> {
		const fileData = await fs.promises.readFile(path.resolve(this.directoryPath, id.concat('.json')), {
			encoding: 'utf8',
		}).catch(() => undefined);
		if (!fileData) {
			return [];
		}

		try {
			return JSON.parse(fileData) as MessageStorePayload[];
		} catch {
			return [];
		}
	}

	async store(id: string, payload: MessageStorePayload): Promise<boolean> {
		const fileKey = path.resolve(this.directoryPath, id.concat('.json'));
		const _ = await fs.promises.stat(fileKey)
			.catch(() => undefined);
		if (!_) {
			await fs.promises.writeFile(fileKey, JSON.stringify([payload])).catch(() => undefined);
			return true;
		}

		const fileData = await fs.promises.readFile(fileKey, {
			encoding: 'utf8',
		}).catch(() => undefined);
		if (!fileData) {
			return false;
		}

		try {
			const combined = JSON.parse(fileData) as MessageStorePayload[];
			combined.push(payload);

			await fs.promises.writeFile(fileKey, JSON.stringify(combined)).catch(() => undefined);
			return true;
		} catch {
			await this.delete(id);
			return false;
		}
	}

	#init(): void {
		if (!fs.existsSync(this.directoryPath)) {
			fs.mkdirSync(this.directoryPath, {
				recursive: true,
			});
		}
	}
}
