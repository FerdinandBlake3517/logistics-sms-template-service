import { infrai } from "./infrai.js";
import { composeApprovedMessage, shipmentEventSchema } from "./logistics_sms.js";

const event = shipmentEventSchema.parse({ shipmentId: process.env.SHIPMENT_ID ?? "demo-482", recipient: process.env.SMS_RECIPIENT ?? "+15550001111", event: "delivered", proofOfDelivery: "pod-482" });
const message = composeApprovedMessage(event);
console.log({ recipient: event.recipient, ...message });
if (process.env.INFRAI_API_KEY) {
  const remoteEvents = await infrai.sms.events(event.shipmentId);
  console.log("Infrai shipment events:", remoteEvents);
}
