import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const protectedPaths = ['/dashboard', '/settings', '/organize'];
      const isProtected = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));
      if (isProtected) return !!token;
      return true;
    },
  },
});

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/organize/:path*'],
};