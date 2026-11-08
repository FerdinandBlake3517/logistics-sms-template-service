import { z } from "zod";

export const shipmentEventSchema = z.object({ shipmentId: z.string().min(1), recipient: z.string().min(1), event: z.enum(["delivered", "exception"]), proofOfDelivery: z.string().optional(), exceptionNote: z.string().optional() });
export type ShipmentEvent = z.infer<typeof shipmentEventSchema>;

export type ApprovedMessage = { signature: string; template: string; text: string };

export function composeApprovedMessage(input: ShipmentEvent): ApprovedMessage {
  const event = shipmentEventSchema.parse(input);
  if (event.event === "delivered") {
    return { signature: "ParcelPath", template: "shipment-delivered", text: `Parcel ${event.shipmentId} delivered. Proof: ${event.proofOfDelivery ?? "available in your shipment record"}.` };
  }
  return { signature: "ParcelPath", template: "shipment-exception", text: `Shipment ${event.shipmentId} needs attention: ${event.exceptionNote ?? "carrier reported an exception"}.` };
}
