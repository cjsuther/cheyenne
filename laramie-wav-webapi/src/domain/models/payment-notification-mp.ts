import { isNull } from "../../infraestructure/sdk/utils/validator";
import { PaymentNotificationMPData as PaymentNotificationMPData } from "./payment-notification-mp-data";

export class PaymentNotificationMP {
  id: string;
  liveMode: boolean;
  type: string;
  dateCreated: Date;
  userId: string;
  apiVersion: string;
  action: string;
  signature: string;
  requestId: string;
  data: PaymentNotificationMPData;

  setFromRequest(signature: string, requestId: string, row) {
    this.id = row.id ?? 0;
    this.liveMode = row.live_mode ?? false;
    this.type = row.type ?? "";
    this.dateCreated = isNull(row.date_created)
      ? new Date(row.date_created)
      : null;
    this.userId = row.user_id ?? "";
    this.apiVersion = row.api_version ?? "";
    this.action = row.action ?? "";
    this.requestId = requestId;
    this.signature = signature;

    this.data = new PaymentNotificationMPData();
    this.data.id = row.data.id;
  }
}
