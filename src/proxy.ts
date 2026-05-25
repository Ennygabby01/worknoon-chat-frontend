import { NextResponse } from "next/server";

const securityHeaders = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()"
};

function getFrameAncestorsPolicy(): string {
  const configuredOrigins = (process.env.WORDPRESS_FRAME_ANCESTORS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return ["'self'", ...configuredOrigins].join(" ");
}

export function proxy() {
  const response = NextResponse.next();

  for (const [header, value] of Object.entries(securityHeaders)) {
    response.headers.set(header, value);
  }

  response.headers.set("content-security-policy", `frame-ancestors ${getFrameAncestorsPolicy()}`);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"
  ]
};
