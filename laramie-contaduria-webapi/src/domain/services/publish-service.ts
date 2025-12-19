import { v4 as uuidv4 } from 'uuid';
import IMessageRouter from '../../infraestructure/sdk/communication/message-router/message-router-interface'
import QueueMessage from '../../infraestructure/sdk/communication/message-router/queue-message';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import { getDateId } from '../../infraestructure/sdk/utils/convert';
import config from '../../server/configuration/config';

export default class PublishService {

    messageRouter:IMessageRouter;

    constructor(messageRouter:IMessageRouter) {
        this.messageRouter = messageRouter;
    }

    async sendMessage(source:string, topic: string, user:string, data: any) {
        return new Promise( async (resolve, reject) => {
			try {
                let queueMessage = new QueueMessage();
                queueMessage.id = uuidv4();
                queueMessage.source = source;
                queueMessage.sendDate = getDateId();
                queueMessage.sendUser = user;
                queueMessage.topic = topic;
                queueMessage.retry = 0;
                queueMessage.data = data;

                await this.messageRouter.connect(config.mq.MQ_HOST, parseInt(config.mq.MQ_PORT), config.mq.MQ_USER, config.mq.MQ_PASSWORD);
                await this.messageRouter.publish(config.mq.MQ_EXCHANGE, topic, queueMessage);
                await this.messageRouter.disonnect();

                resolve(queueMessage);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
        });
    }

}