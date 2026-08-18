import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    let isAuthentic = false;

    // Verify signature if keys are present and it is not a mock order
    if (key_secret && !razorpay_order_id.startsWith("order_mock_")) {
      const generated_signature = crypto
        .createHmac("sha256", key_secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature === razorpay_signature) {
        isAuthentic = true;
      }
    } else if (razorpay_order_id.startsWith("order_mock_")) {
      // Allow mock orders for development testing
      isAuthentic = true;
    }

    if (!isAuthentic) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Mark Order as Processing & Payment Success
    const { error: orderError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        order_status: "processing"
      })
      .eq("id", orderId);

    if (orderError) throw orderError;

    // Create Payment Record
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("total")
      .eq("id", orderId)
      .single();

    await supabaseAdmin.from("payments").insert({
      order_id: orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: order?.total || 0,
      status: "success"
    });

    return NextResponse.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Payment Verify Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
