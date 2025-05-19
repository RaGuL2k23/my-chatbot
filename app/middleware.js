import { updateSession } from './utils/supabase/middleware';
 
export async function middleware(request) {
  return await updateSession(request);
}
// middlware here provide by supabase is only for updaing not for protecting 
export const config = {
  matcher: [
    // Match everything EXCEPT:
    // - Static files
    // - Image optimization
    // - Favicon
    // - Public assets like .png, .jpg, etc.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(svg|png|jpg|jpeg|gif|webp)).*)',
  ],
};
