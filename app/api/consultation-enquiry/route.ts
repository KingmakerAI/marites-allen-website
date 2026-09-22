import { NextResponse } from "next/server";
import { submitConsultationEnquiryAction } from "@/app/signup/consultation-enquiry";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await submitConsultationEnquiryAction(body);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (err) {
    console.error("[api/consultation-enquiry]", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't submit your enquiry right now. Please try again or contact us directly via WhatsApp or email."
      },
      { status: 500 }
    );
  }
}
