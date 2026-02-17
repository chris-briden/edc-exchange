import { Shippo } from "shippo";

// Lazy-initialize Shippo to avoid build-time errors when env vars aren't set
let _shippo: Shippo | null = null;

export function getShippo(): Shippo {
  if (!_shippo) {
    const apiKey = process.env.SHIPPO_API_KEY;
    if (!apiKey) {
      throw new Error("SHIPPO_API_KEY is not set");
    }
    _shippo = new Shippo({ apiKeyHeader: apiKey });
  }
  return _shippo;
}
