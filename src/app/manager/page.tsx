"use client"

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/docker-api";
import { PageHeader, Card } from "@/components/DataPanel";
import { Boxes, Cpu, Network, HardDrive, Activity } from "lucide-react";
import Link from "next/link";

function Stat({ icon: Icon, label, value, to }: any) {
  return (
    <Link href={to} className="block">
      <Card className="p-5 transition hover:border-primary/40 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">{label}</div>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
      </Card>
    </Link>
  );
}

export default function Overview() {
  const health = useQuery({ queryKey: ["health"], queryFn: api.health, refetchInterval: 10000 });
  const images = useQuery({ queryKey: ["images"], queryFn: api.images });
  const networks = useQuery({ queryKey: ["networks"], queryFn: api.networks });
  const procs = useQuery({ queryKey: ["processes"], queryFn: api.processes });
  const volumes = useQuery({ queryKey: ["volumes"], queryFn: api.volumes });

  const count = (q: any) => (Array.isArray(q.data) ? q.data.length : q.isLoading ? "…" : "?");

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Inspecione containers, redes, imagens e volumes do seu host Docker."
        action={
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
            <Activity className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-muted-foreground">
              {health.isLoading ? "Verificando…" : health.isError ? "Offline" : "API online"}
            </span>
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat icon={Cpu} label="Processos" value={count(procs)} to="/processes" />
        <Stat icon={Boxes} label="Images" value={count(images)} to="/images" />
        <Stat icon={Network} label="Networks" value={count(networks)} to="/networks" />
        <Stat icon={HardDrive} label="Volumes" value={count(volumes)} to="/volumes" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Containers recentes</h2>
          <ul className="divide-y divide-border">
            {(procs.data as any[] | undefined)?.slice(0, 6).map((p, i) => (
              <li key={i} className="flex items-center justify-between py-2 text-sm">
                <span className="font-medium">{p.Names || p.name || p.Id?.slice(0, 12)}</span>
                <span className="text-xs text-muted-foreground">{p.Status || p.status}</span>
              </li>
            )) ?? <li className="py-2 text-sm text-muted-foreground">Sem dados</li>}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Redes</h2>
          <ul className="divide-y divide-border">
            {(networks.data as any[] | undefined)?.slice(0, 6).map((n, i) => (
              <li key={i} className="flex items-center justify-between py-2 text-sm">
                <span className="font-medium">{n.Name || n.name}</span>
                <span className="text-xs text-muted-foreground">{n.Driver || n.driver}</span>
              </li>
            )) ?? <li className="py-2 text-sm text-muted-foreground">Sem dados</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}
