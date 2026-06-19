export const WS_BASE = process.env.NEXT_PUBLIC_WS_SERVER || "ws://localhost:8000";

export function terminalWsUrl(container: string, shell = "sh") {
  return `${WS_BASE}/terminal/container?container=${encodeURIComponent(container)}&shell=${encodeURIComponent(shell)}`;
}