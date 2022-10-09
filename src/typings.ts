export type MessagePayload = {
	id: string;
	msg: string;
	time_now: string;
};

export type MessageStorePayload = {
	[x: string]: any;
	time: number;
	message: string;
};
