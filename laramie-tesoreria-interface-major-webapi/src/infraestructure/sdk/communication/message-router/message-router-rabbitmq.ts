import amqp from "amqplib";
import IMessageRouter from "./message-router-interface";
import QueueMessage from "./queue-message";
import ProcessError from "../../error/process-error";


export default class MessageRouterRabbitMQ implements IMessageRouter {

    private reply: boolean = false;
    private connection: amqp.Connection = null;
    private channel: amqp.Channel = null;

    constructor() {

    }

    connect(host:string, port: number, username:string, password:string) {
        return new Promise( async (resolve, reject) => {
            try {
                if (host === "localhost") {
                    this.connection = await amqp.connect("amqp://localhost");
                }
                else {
                    this.connection = await amqp.connect({
                        protocol: "amqp",
                        hostname: host,
                        port: port,
                        username: username,
                        password: password
                    });
                }
                this.channel = await this.connection.createChannel();
                resolve({result: true});
            }
            catch(error) {
                reject(new ProcessError('Error procesando mensaje', error));
            }
        });
    }

    disonnect() {
        return new Promise( async (resolve, reject) => {
            try {	
                if (this.connection) {
                    await this.channel.close();	
                    await this.connection.close();
                    this.channel = null;
                    this.connection = null;
                }
                resolve({result: true});
            }
            catch(error) {
                reject(new ProcessError('Error procesando mensaje', error));
            }
        });
    }

    subscribe(exchangeName:string, queueName:string, topics:string[]) {
        return new Promise( async (resolve, reject) => {
            try {
                await this.channel.assertExchange(exchangeName, 'direct', {durable: true});
                this.channel.assertQueue(queueName, {durable: true})
                .then(async queue => {
                    for (let i=0; i < topics.length; i++) {
                        const topic = topics[i];
                        await this.channel.bindQueue(queueName, exchangeName, topic);
                    }
                    resolve({result: true});
                })
                .catch(error => reject(new ProcessError('Error procesando mensaje', error)));
            }
            catch(error) {
                reject(new ProcessError('Error procesando mensaje', error));
            }
        });
    }

    publish(exchangeName:string, topic:string, message:QueueMessage) {
        return new Promise( async (resolve, reject) => {
            try {
                await this.channel.assertExchange(exchangeName, 'direct', {durable: true});
                const result = this.channel.publish(exchangeName, topic, Buffer.from(JSON.stringify(message)), {persistent: true});
                resolve({result: result});
                if (result) {
                    resolve({result: true});
                }
                else {
                    reject(new ProcessError('Error procesando mensaje', new Error("Publication refused")));
                }
            }
            catch(error) {
                reject(new ProcessError('Error procesando mensaje', error));
            }
        });
    }

    receive(queueName:string, callbackMessage:any) {
        return new Promise(async (resolve, reject) => {
            try {
                this.channel.consume(queueName, (message) => {
                    const topic = message.fields.routingKey;
                    const messageJSON = JSON.parse(message.content.toString());
                    let queueMessage = new QueueMessage();
                    queueMessage.setFromObject(messageJSON);

                    if (callbackMessage(topic, queueMessage)) {
                        this.channel.ack(message);
                    }
                    else {
                        if (this.reply)
                            this.channel.nack(message);
                        else
                            this.channel.ack(message);
                    }
                });
                resolve({result: true});
            }
            catch(error) {
                reject(new ProcessError('Error procesando mensaje', error));
            }
        });
    }

}