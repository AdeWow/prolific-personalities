// Server-side GA4 Measurement Protocol integration.
// Fires purchase events from the Stripe webhook so conversions are
// recorded even when the client-side tag doesn't fire (ad blockers,
// tab closed before redirect, etc.).
//
// GA4_API_SECRET env var required:
//   GA4 → Admin → Data Streams → your stream →
//   Measurement Protocol API Secrets → Create.

const GA4_MEASUREMENT_ID = "G-LB3WGLMTST";

interface PurchaseEventData {
  /** Stable customer identifier — email preferred, Stripe customer ID fallback */
  clientId: string;
  /** Stripe session ID used as transaction_id */
  transactionId: string;
  /** Total in cents from Stripe — converted to dollars here */
  amountTotalCents: number;
  /** Product archetype if available */
  archetype?: string;
}

/**
 * Send a server-side purchase_completed event to GA4 via Measurement Protocol.
 * Wrapped in try/catch — a failed analytics call must never break the purchase flow.
 */
export async function sendGA4PurchaseEvent(data: PurchaseEventData): Promise<void> {
  const apiSecret = process.env.GA4_API_SECRET;
  if (!apiSecret) {
    console.warn("⚠️ GA4_API_SECRET not set — skipping server-side purchase event");
    return;
  }

  try {
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${apiSecret}`;

    const body = {
      client_id: data.clientId,
      events: [
        {
          name: "purchase_completed",
          params: {
            currency: "USD",
            value: data.amountTotalCents / 100,
            transaction_id: data.transactionId,
            source: "server",
            ...(data.archetype ? { archetype: data.archetype } : {}),
          },
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(
        `❌ GA4 Measurement Protocol error: ${response.status} ${response.statusText}`
      );
    } else {
      console.log(
        `✅ GA4 server-side purchase_completed sent for transaction ${data.transactionId}`
      );
    }
  } catch (error) {
    console.error("❌ GA4 Measurement Protocol call failed (non-blocking):", error);
  }
}
