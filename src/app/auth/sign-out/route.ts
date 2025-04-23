import { signOut } from "@server/auth";
import { routes } from "@/routes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rd = searchParams.get("rd");

  await signOut();

  let redirectPath = routes.auth.login();

  if (rd) {
    const loginParams = new URLSearchParams({ rd });
    redirectPath += `?${loginParams.toString()}`;
  }

  return NextResponse.redirect(redirectPath);
}
