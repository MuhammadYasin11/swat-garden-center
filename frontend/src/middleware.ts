import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get('host'); // e.g., "admin.localhost:3000"

    // 1. Check if we are on the admin subdomain
    const isAdminSubdomain = hostname?.startsWith('admin.');

    // 2. If it's admin, rewrite the URL to the internal /admin folder
    if (isAdminSubdomain) {
        // Prevent doubling the /admin path if explicitly provided in the URL
        const path = url.pathname.startsWith('/admin') ? url.pathname : `/admin${url.pathname}`;
        return NextResponse.rewrite(new URL(path, req.url));
    }

    // 3. Otherwise, serve the regular store (from the root or (store) group)
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
