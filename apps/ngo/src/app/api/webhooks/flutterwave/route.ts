import { NextResponse } from "next/server";
import { processProviderWebhook } from "@/lib/actions/donations";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("verif-hash");
  try {
    await processProviderWebhook("flutterwave", rawBody, signature);
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid signature or payload" }, { status: 401 });
  }
}
