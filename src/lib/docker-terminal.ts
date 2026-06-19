import { Environment } from "@/service/environment";

export async function terminalWsUrl(container: string, shell = "sh") {
  const env = await Environment()
  const WS_BASE = env.WS_SERVER || "ws://localhost:8000";
  
  return `${WS_BASE}/terminal/container?container=${encodeURIComponent(container)}&shell=${encodeURIComponent(shell)}`;
}