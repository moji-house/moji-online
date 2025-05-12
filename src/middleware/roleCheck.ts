import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Public paths that don't require role check
  const publicPaths = ['/login', '/register', '/api/auth'];
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path.startsWith(publicPath)
  );
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Get the token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // For API routes, we'll let the API handle role checks
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // For client routes, we'll check if the user has a role
  // If not, we'll redirect to a page that will show the role selection modal
  // The actual role check will happen client-side
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except for:
    // - API routes that handle their own auth
    // - Static files (images, etc)
    // - Favicon
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};