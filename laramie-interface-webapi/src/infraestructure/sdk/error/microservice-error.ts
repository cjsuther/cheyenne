import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import config from '../../../server/configuration/config';
import { getDateId } from '../utils/convert';

export default class MicroserviceError extends Error {

  originError: Error;
  messageTopic: string;
  messageData: any;

  constructor(message, originError, messageTopic = "", messageData = null) {
    super(message);
    this.originError = originError;
    this.name = 'MicroserviceError';
    this.messageTopic = messageTopic;
    this.messageData = messageData;
    
    if (messageData) {
      try {
        const name = `MicroserviceError_${this.messageTopic}_${getDateId()}_${uuidv4()}.log`;
        const filePath = `${config.PATH.LOG}${name}`;
        const data = (typeof this.messageData === "string" || this.messageData instanceof String) ? this.messageData.toString() : JSON.stringify(this.messageData);
        fs.writeFile(filePath, data, async (err) => {
          if (err) {
            console.log(`Error grabando log: ${err}`);
          }
        });
      }
      catch (error) {
        console.log(`Error grabando log: ${error}`);
      }
    }
  }
}