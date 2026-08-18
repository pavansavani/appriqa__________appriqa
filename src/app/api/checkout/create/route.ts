import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

// Ideally you'd use a Razorpay SDK, but we can do a mock if credentials aren't present.
// Since the prompt requires server-side Razorpay logic, we will build it out fully.
export async function POST(request: Request) {
  try {
    const { addressId, cartItems, subtotal, discount, shippingFee, tax, total } = await request.json();

    // In a real app we'd get the auth header to identify the user securely.
    // We'll trust the request body for simplicity or require an auth token.
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch Address to snapshot
    let addressSnapshot = null;
    if (addressId) {
      const { data: address } = await supabaseAdmin
        .from("addresses")
        .select("*")
        .eq("id", addressId)
        .eq("user_id", user.id)
        .single();
        
      if (address) {
        addressSnapshot = address;
      }
    }

    // Generate unique order number
    const orderNumber = "AP-" + Math.floor(100000 + Math.random() * 900000);

    // 2. Create Order in DB (Pending)
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        payment_status: "pending",
        order_status: "pending",
        shipping_full_name: addressSnapshot?.full_name,
        shipping_phone: addressSnapshot?.phone,
        shipping_address_line_1: addressSnapshot?.address_line_1,
        shipping_address_line_2: addressSnapshot?.address_line_2,
        shipping_landmark: addressSnapshot?.landmark,
        shipping_city: addressSnapshot?.city,
        shipping_state: addressSnapshot?.state,
        shipping_postal_code: addressSnapshot?.postal_code,
        shipping_country: addressSnapshot?.country,
        subtotal,
        discount,
        shipping_fee: shippingFee,
        tax,
        total
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Create Order Items
    const itemsToInsert = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id.toString(),
      product_name: item.name,
      quantity: item.quantity,
      price: item.price
    }));
    await supabaseAdmin.from("order_items").insert(itemsToInsert);

    // 4. Create Razorpay Order Server-side
    // Check if real keys exist. If not, generate a mock razorpay_order_id.
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    let rzpOrderId = "order_mock_" + Math.random().toString(36).substring(7);
    
    if (key_id && key_secret) {
      const auth = Buffer.from(`${key_id}:${key_secret}`).toString("base64");
      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${auth}`
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // in paise
          currency: "INR",
          receipt: order.id
        })
      });
      
      const rzpData = await rzpRes.json();
      if (rzpRes.ok) {
        rzpOrderId = rzpData.id;
      } else {
        console.error("Razorpay error:", rzpData);
        throw new Error("Failed to create Razorpay order");
      }
    }

    return NextResponse.json({ orderId: order.id, rzpOrderId, amount: total * 100 });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
