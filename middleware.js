import { NextResponse } from 'next/server';

export function middleware(request) {
  // This is a simple middleware that just passes through all requests
  // You can customize this to add headers, redirect, or other logic as needed
  return NextResponse.next();
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware
export const config = {
  // Only run middleware on the homepage and api routes as an example
  // Adjust as needed for your application
  matcher: ['/', '/api/:path*'],
};
