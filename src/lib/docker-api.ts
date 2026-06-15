import { DockerImage } from "@/types/image";
import { DockerProcess } from "@/types/process";

export const API_BASE = "http://212.85.1.223:8000";
export const WS_BASE = "ws://212.85.1.223:8000";

async function j<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`, init);
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

export const api = {
  health: () => j<any>("/health"),

  images: () => j<DockerImage[]>("/image/"),
  imageRemove: (id: string) => j<any>(`/image/${encodeURIComponent(id)}`, { method: "DELETE" }),
  imageRun: (payload: { image: string; name?: string; ports?: string; volumes?: string }) =>
    j<any>("/image/run", json(payload)),

  networks: () => j<any[]>("/network/"),
  network: (id: string) => j<any>(`/network/${id}`),
  networkRemove: (id: string) => j<any>(`/network/${encodeURIComponent(id)}`, { method: "DELETE" }),
  networkConnect: (id: string, container: string) =>
    j<any>(`/network/${encodeURIComponent(id)}/connect`, json({ container })),
  networkDisconnect: (id: string, container: string) =>
    j<any>(`/network/${encodeURIComponent(id)}/disconnect`, json({ container })),

  processes: () => j<DockerProcess[]>("/process/"),
  processStop: (id: string) => j<any>(`/process/${encodeURIComponent(id)}/stop`, { method: "POST" }),
  processRestart: (id: string) => j<any>(`/process/${encodeURIComponent(id)}/restart`, { method: "POST" }),

  volumes: () => j<any[]>("/volume/"),
  volume: (name: string) => j<any>(`/volume/${name}`),
  volumeFiles: (name: string, path = "/") =>
    j<any>(`/volume/${encodeURIComponent(name)}/files?path=${encodeURIComponent(path)}`),
  volumeRemove: (name: string) => j<any>(`/volume/${encodeURIComponent(name)}`, { method: "DELETE" }),
  volumeBackupUrl: (name: string) => `${API_BASE}/volume/${encodeURIComponent(name)}/backup`,

  logsTail: (identifier: string, tail = 200) =>
    fetch(`${API_BASE}/log/tail?identifier=${encodeURIComponent(identifier)}&tail=${tail}`).then(r => r.text()),

  exec: (container: string, command: string) =>
    j<any>("/command/", json({ container, command })),
};

export function terminalWsUrl(container: string, shell = "sh") {
  return `${WS_BASE}/terminal/container?container=${encodeURIComponent(container)}&shell=${encodeURIComponent(shell)}`;
}

export function containerLabel(c: any): string {
  return c?.Names || c?.name || c?.Id?.slice(0, 12) || c?.id?.slice(0, 12) || "?";
}
export function containerId(c: any): string {
  return c?.Id || c?.id || c?.Names || c?.name;
}
