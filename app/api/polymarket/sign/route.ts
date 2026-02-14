// Remote signing for builder authentication (RelayClient) and order attribution (ClobClient)
// Builder credentials stay server-side; client requests signatures via this endpoint
// @see https://github.com/Polymarket/wagmi-safe-builder-example

import { NextRequest, NextResponse } from "next/server";
import { buildHmacSignature } from "@polymarket/builder-signing-sdk";

const BUILDER_KEY = process.env.POLYMARKET_BUILDER_API_KEY ?? process.env.BUILDER_API_KEY;
const BUILDER_SECRET = process.env.POLYMARKET_BUILDER_SECRET ?? process.env.BUILDER_SECRET;
const BUILDER_PASSPHRASE = process.env.POLYMARKET_BUILDER_PASSPHRASE ?? process.env.BUILDER_PASS_PHRASE;

export async function POST(request: NextRequest) {
  try {
    if (!BUILDER_KEY || !BUILDER_SECRET || !BUILDER_PASSPHRASE) {
      return NextResponse.json(
        { error: "Builder credentials not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const method = body.method as string;
    const path = body.path as string;
    const requestBody = (body.body as string) ?? "";

    if (!method || !path) {
      return NextResponse.json(
        { error: "Missing required parameters: method, path" },
        { status: 400 }
      );
    }

    const sigTimestamp = Date.now().toString();
    const signature = buildHmacSignature(
      BUILDER_SECRET,
      parseInt(sigTimestamp),
      method,
      path,
      requestBody
    );

    return NextResponse.json({
      POLY_BUILDER_SIGNATURE: signature,
      POLY_BUILDER_TIMESTAMP: sigTimestamp,
      POLY_BUILDER_API_KEY: BUILDER_KEY,
      POLY_BUILDER_PASSPHRASE: BUILDER_PASSPHRASE,
    });
  } catch (error) {
    console.error("Polymarket sign error:", error);
    return NextResponse.json(
      { error: "Failed to sign message" },
      { status: 500 }
    );
  }
}
