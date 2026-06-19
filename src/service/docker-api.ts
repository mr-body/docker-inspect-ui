"use server";

import { DockerImage } from "@/types/image";
import { DockerNetwork, DockerNetworkInspect } from "@/types/network";
import { DockerProcess } from "@/types/process";

const API_BASE = process.env.SERVER || "http://localhost:8000";

async function j<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`, {
    ...init,
    cache: "no-store", // Ensure we don't cache mutable server actions by default
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    throw new Error(`${r.status} ${r.statusText}${txt ? ` — ${txt}` : ""}`);
  }
  const ct = r.headers.get("content-type") || "";
  return (ct.includes("json") ? r.json() : (r.text() as any)) as Promise<T>;
}

const json = (body: unknown): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// Health
export async function healthAction() {
  return j<any>("/health");
}

// Images
export async function imagesAction() {
  return j<DockerImage[]>("/image/");
}

export async function imageRemoveAction(id: string) {
  return j<any>(`/image/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function imageRunAction(payload: { image: string; name?: string; ports?: string; volumes?: string }) {
  return j<any>("/image/run", json(payload));
}

// Networks
export async function networksAction() {
  return j<DockerNetwork[]>("/network/");
}

export async function networkAction(id: string) {
  return j<DockerNetworkInspect>(`/network/${id}`);
}

export async function networkRemoveAction(id: string) {
  return j<any>(`/network/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function networkConnectAction({ id, container }: { id: string; container: string }) {
  return j<any>(`/network/${encodeURIComponent(id)}/connect`, json({ container }));
}

export async function networkDisconnectAction({ id, container }: { id: string; container: string }) {
  return j<any>(`/network/${encodeURIComponent(id)}/disconnect`, json({ container }));
}

// Processes
export async function processesAction() {
  return j<DockerProcess[]>("/process/");
}

export async function processStopAction(id: string) {
  return j<any>(`/process/${encodeURIComponent(id)}/stop`, { method: "POST" });
}

export async function processRestartAction(id: string) {
  return j<any>(`/process/${encodeURIComponent(id)}/restart`, { method: "POST" });
}

// Volumes
export async function volumesAction() {
  return j<any[]>("/volume/");
}

export async function volumeAction(name: string) {
  return j<any>(`/volume/${name}`);
}

export async function volumeFilesAction({ name, path = "/" }: { name: string; path?: string }) {
  return j<any>(`/volume/${encodeURIComponent(name)}/files?path=${encodeURIComponent(path)}`);
}

export async function volumeRemoveAction(name: string) {
  return j<any>(`/volume/${encodeURIComponent(name)}`, { method: "DELETE" });
}

export async function volumeBackupUrlAction(name: string) {
  // Return the URL as a string
  return `${API_BASE}/volume/${encodeURIComponent(name)}/backup`;
}

// Logs
export async function logsTailAction({ identifier, tail = 200 }: { identifier: string; tail?: number }) {
  const r = await fetch(`${API_BASE}/log/tail?identifier=${encodeURIComponent(identifier)}&tail=${tail}`);
  return r.text();
}

// Exec
export async function execAction({ container, command }: { container: string; command: string }) {
  return j<any>("/command/", json({ container, command }));
}
