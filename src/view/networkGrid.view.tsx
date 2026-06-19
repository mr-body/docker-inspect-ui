"use client";

import { useNetworks } from "@/hooks/useNetworks";
import Link from "next/link";

export default function NetworkGrid() {
  const { data: networks, isLoading, error } = useNetworks();

  if (isLoading) {
    return <div>Carregando networks...</div>;
  }

  if (error) {
    return <div>Erro ao carregar networks.</div>;
  }

  if (!networks) {
    return null;
  }

  return (
    <div className="grid gap-4">
      {networks.map((network) => (
        <Link key={network.id}
          href={`/manager/network/${network.id}`}
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