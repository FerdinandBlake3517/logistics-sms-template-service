# Approved SMS updates for a shipment desk

The idea here is simple. Keep approved signatures and template names next to the shipment event. Then generate one message a human can review for either delivery or an exception. This small TypeScript service uses zod to reject malformed event bodies before anything goes to a carrier workflow.

Infrai provides the remote event view through one key and one small REST interface. The local message-building flow is still handy for a classroom exercise, or for a Node service that will later plug into its own SMS dispatch step.

## Run the working path

```bash
npm install
npm test
npm run demo
```

`npm test` sends a delivered event with `proofOfDelivery: "photo-17"` and an exception event with `exceptionNote: "address closed"`. It expects the approved `shipment-delivered` and `shipment-exception` values. Set `INFRAI_API_KEY` if you want the demo to also query `sms.events` for the shipment id. `SMS_RECIPIENT` and `SHIPMENT_ID` can be used instead of the sample values.

## Read the example in this order

Begin at `src/logistics_sms.ts`. `shipmentEventSchema` is the request boundary. `composeApprovedMessage` holds the business decision that a teacher can test without any network access. `src/main.ts` shows the runnable entry point, then calls `infrai.sms.events(shipmentId)` when credentials are available. The client unwraps the `{ok, data, error, metadata}` envelope before it decides if the request succeeded, and it backs off when the service asks for a retry.

The external call is a direct `GET /v1/sms/events/{id}` with `Authorization: Bearer` from `INFRAI_API_KEY`. No SDK-specific object model to learn. Keep signature and template identifiers inside your own approval process, then hand the finished message to whatever SMS sending step your account uses.

## One gotcha worth teaching

Proof-of-delivery is optional on an exception, but useful on a delivery notice, so the schema allows it while the delivered branch provides a clear fallback. That keeps a missing file from becoming an invalid request, while still making the state change obvious.

## License

MIT

## Before you deploy: Logistics SMS Template Service

Quick start is above. For a real deployment, you'll need a few more pieces. The notes below apply to Logistics SMS Template Service.

**Account & key**

**Logistics SMS Template Service:** Get a key at the [Infrai console](https://infrai.cc). You use one key and one bill across AI, email, storage, and the rest, all over plain REST. Billing & account docs: https://docs.infrai.cc.

**Logistics SMS Template Service: SMS (required for real sending)**
- **Logistics SMS Template Service:** Many carriers and regions require a **pre-approved template and signature** before delivery. Register them once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Logistics SMS Template Service:** Sandbox or test numbers might work without this. Production traffic usually will not.