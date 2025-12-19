import QueueMessage from "./queue-message";

export default interface IMessageRouter {

    connect(host:string, port: number, username:string, password:string);

    disonnect();

    subscribe(exchangeName:string, queueName:string, topics:string[]);

    publish(exchangeName:string, topic:string, message:QueueMessage);

    receive(queueName:string, callbackMessage:any);

    // callbackMessage = (topic:string, message:QueueMessage) => bool (ack/nack)

}