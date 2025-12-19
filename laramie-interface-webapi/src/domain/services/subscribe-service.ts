import container from '../../infraestructure/ioc/dependency-injection';
import IMessageRouter from '../../infraestructure/sdk/communication/message-router/message-router-interface';
import QueueMessage from '../../infraestructure/sdk/communication/message-router/queue-message';
import QueueMessageExecute from './process/queue-message/queue-message-execute';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import config from '../../server/configuration/config';


export default class SubscribeService {

    messageRouter:IMessageRouter;

    constructor(messageRouter:IMessageRouter, queueMessageExecute:QueueMessageExecute) {
        this.messageRouter = messageRouter;
        
    }

    async connectQueue(topics:string[]) {
        return new Promise( async (resolve, reject) => {
            try {
                if (topics.length > 0) {
                    await this.messageRouter.connect(config.mq.MQ_HOST, parseInt(config.mq.MQ_PORT), config.mq.MQ_USER, config.mq.MQ_PASSWORD);
                    await this.messageRouter.subscribe(config.mq.MQ_EXCHANGE, config.mq.MQ_QUEUE, topics);
                    await this.messageRouter.receive(config.mq.MQ_QUEUE, this.processQueueMessage);
                }
                resolve({result: true});
            }
            catch(error) {
                reject(new ProcessError('Error iniciando cola de mensajes', error));
            }
        });
    }

    async disonnectQueue() {
        return new Promise( async (resolve, reject) => {
            try {
                await this.messageRouter.disonnect();
                resolve({result: true});
            }
            catch(error) {
                reject(new ProcessError('Error cerrando cola de mensajes', error));
            }
        });
    }

    async processQueueMessage(topic:string, message:QueueMessage) {
        try {
            const queueMessageExecute = container.resolve("queueMessageExecute") as QueueMessageExecute;		
            const response:any = await queueMessageExecute.execute(topic, message);
            return response.result;
        }
        catch(error) {
            throw error;
        }
    }
    
}
