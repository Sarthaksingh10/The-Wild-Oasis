/* import { NextResponse } from "next/server";
//Middleware works for every route in the starting point.
export function middleware(request) {
  console.log(request);

  return NextResponse.redirect(new URL("/about", request.url)); //This will create an infinite loop redirecting url to /about
}
 */

import { auth } from "./app/_lib/auth";

export const middleware = auth;
export const config = {
  matcher: ["/account"], //This helps ending the above loop created by middleware and redirects to /about only when url matches the given matchers
};
