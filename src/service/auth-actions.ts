"use server";

import { cookies } from "next/headers";
import { getToken } from "@/lib/getToken";

const API_BASE = process.env.SERVER || "http://localhost:8000";

export async function loginAction(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await res.json();
  const token = data.access_token;

  if (token) {
    const cookieStore = await cookies();
    cookieStore.set({
      name: "access_token",
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });
    return true;
  }
  return false;
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  return true;
}

export async function getSessionAction() {
  const token = await getToken();
  if (token) {
    return { token };
  }
  return null;
}
