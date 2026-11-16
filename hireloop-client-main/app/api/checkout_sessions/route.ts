import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { getSession } from "@/lib/core/server"

export async function POST() {
  try {
    const userSession = await getSession()
    const headersList = await headers()
    const origin = headersList.get("origin")

    if (!userSession?.user) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 })
    }
    const priceId =
      userSession.user.role === "recruiter"
        ? "price_1Uba3H3r7syD08pc3WgK2bIf"
        : "price_1Ub0oO3r7syD08pcNW5jsieV"

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      
      customer_email: userSession?.user.email,
      metadata: {
        userId: userSession.user.id,
       role: userSession.user.role ?? "",
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: "hire_loop_web-001",
    })
    return NextResponse.json({
      url: session.url,
    })
  } catch (err) {
    const error: Error & { statusCode?: number } =
      err instanceof Error ? err : new Error(String(err))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
