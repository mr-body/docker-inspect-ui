import { DockerNetworkService } from "@/service/network";
import Link from "next/link";

export default async function NetworkGrid() {
  const docker = new DockerNetworkService();

  const networks = await docker.getNetworks();

  return (
    <div className="grid gap-4">
      {networks.map((network) => (
        <Link key={network.id}
          href={`/network/${network.id}`}
          className=" border rounded-lg p-4 hover:border-blue-500 hover:bg-zinc-900/40 transition">
          <p>
            <strong>ID:</strong> {network.id}
          </p>

          <p>
            <strong>Name:</strong> {network.name}
          </p>

          <p>
            <strong>Driver:</strong> {network.driver}
          </p>

          <p>
            <strong>Scope:</strong> {network.scope}
          </p>
        </Link>
      ))}
    </div>
  );
}