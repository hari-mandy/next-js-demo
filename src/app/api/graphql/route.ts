import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const sessionCookie = req.cookies.get("woocommerce-session")?.value;
  const authToken = req.cookies.get("authToken")?.value || process.env.WORDPRESS_AUTH_REFRESHER_TOKEN;

  // Forward request to WordPress GraphQL API
  const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
      ...(sessionCookie && { "woocommerce-session": sessionCookie }),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  // Capture updated session header
  const newSession = response.headers.get("woocommerce-session");

  // Prepare the response
  const nextResponse = NextResponse.json(data);

  if (newSession) {
    nextResponse.cookies.set("woocommerce-session", `Session ${newSession}`, {
      path: "/",
      httpOnly: false, // must be accessible from browser JS
      sameSite: "lax",
    });
  }

  return nextResponse;
}
