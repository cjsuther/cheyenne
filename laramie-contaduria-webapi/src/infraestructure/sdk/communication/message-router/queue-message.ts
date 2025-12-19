export default class QueueMessage {

    id: string;
	source: string;
	sendDate: string;
	sendUser: string;
	topic: string;
	retry: number;
	data: any;

	constructor(
        id: string = "",
		source: string = "",
		sendDate: string = "",
		sendUser: string = "",
		topic: string = "",
		retry: number = 0,
		data: any = null
	)
	{
        this.id = id;
		this.source = source;
		this.sendDate = sendDate;
		this.sendUser = sendUser;
		this.topic = topic;
		this.retry = retry;
		this.data = data;
	}

	setFromObject = (row) =>
	{
		this.id = row.id ?? "";
		this.source = row.source ?? "";
		this.sendDate = row.sendDate ?? "";
		this.sendUser = row.sendUser ?? "";
		this.topic = row.topic ?? "";
		this.retry = row.retry ?? 0;
		this.data = row.data ?? null;
	}

}