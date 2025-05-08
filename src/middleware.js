import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Profile routes that should be protected
  const isProfileRoute = path.startsWith('/route/profile');
  
  // Verify the session
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If accessing a protected route without being logged in
  if (isProfileRoute && !session) {
    const url = new URL('/api/auth/signin', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    '/route/profile/:path*',
  ],
};
