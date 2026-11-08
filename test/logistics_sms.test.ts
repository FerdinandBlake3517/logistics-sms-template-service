import assert from "node:assert/strict";
import { composeApprovedMessage } from "../src/logistics_sms.js";

const delivered = composeApprovedMessage({ shipmentId: "S-17", recipient: "+1555", event: "delivered", proofOfDelivery: "photo-17" });
assert.equal(delivered.template, "shipment-delivered");
assert.match(delivered.text, /photo-17/);
assert.equal(delivered.signature, "ParcelPath");

const exception = composeApprovedMessage({ shipmentId: "S-18", recipient: "+1555", event: "exception", exceptionNote: "address closed" });
assert.equal(exception.template, "shipment-exception");
assert.match(exception.text, /address closed/);
console.log("logistics SMS decision test passed");
