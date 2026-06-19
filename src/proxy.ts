import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;

    // se não tiver token → redireciona
    if (!token) {
        const url = new URL("/sign-in", request.url);
        return NextResponse.redirect(url);
    }

    // se tiver token → deixa passar
    return NextResponse.next();
}

export const config = {
    matcher: ["/manager/:path*", "/shell/:path*"],
};