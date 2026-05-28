import { ServerManagementTable } from "@/components/ui/server-management-table";
import StackIcon from "@/components/ui/stackI-con";
import { DockerNetworkService } from "@/service/network";
import { Download, List, Network, RefreshCw, Trash2 } from "lucide-react";
import { NetworkDiagram } from "./NetworkDiagram";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BsDiagram2, BsList } from "react-icons/bs";
import { Button } from "@/components/ui/button";

interface RouteProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
export default async function NetworkIDPage({ params }: RouteProps) {
  const docker = new DockerNetworkService();
  const id = (await params).id;
  const network = await docker.getNetwork(id);

  return (
    <Tabs defaultValue="containers" className="w-full flex flex-col p-0 m-0 justify-start relative">
      {/* HEADER */}
      <div className="sticky top-0 flex-col z-10 backdrop-blur border-b border-muted  pt-6 flex  gap-4 ">
        <header className="z-10 backdrop-blur flex justify-betweenw-full w-full">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {network.name}
                </h1>
              </div>
              <p className="text-[11px] font-mono text-muted-foreground mt-1 leading-none">
                {network.id}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground font-mono border px-2 py-1 rounded-md bg-muted/30">
              docker network
            </span>
          </div>
        </header>
        <div className="flex justify-between items-center h-12">
          <TabsList className="h-full gap-1 rounded-none bg-transparent p-0">
            <TabsTrigger
              value="containers"
              className="flex items-center gap-1.5 h-full border-0 rounded-md px-3 text-sm text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent"
            >
              <BsList className="w-4 h-4" />
              Containers
            </TabsTrigger>
            <TabsTrigger
              value="diagram"
              className="flex items-center gap-1.5 h-full border-0 rounded-md px-3 text-sm text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent"
            >
              <BsDiagram2 className="w-4 h-4" />
              Diagram
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
              <RefreshCw className="w-3.5 h-3.5" />
              Atualizar
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-3.5 h-3.5" />
              Deletar
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Download className="w-3.5 h-3.5" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-1 gap-6 py-3">

        {/* TABLE */}
        <div className="flex-1">
          <TabsContent value="containers">
            <ServerManagementTable containers={network.containers} />
          </TabsContent>
          <TabsContent value="diagram" className="flex-1 bg-blue-700 rounded-sm">
            <NetworkDiagram containers={network.containers} gatewayIp={network.ipam?.Config?.length && network.ipam.Config[0].Subnet || "default"} />
          </TabsContent>
        </div>

        {/* SIDEBAR */}
        <aside className="w-72 shrink-0 space-y-3 sticky top-40 self-start">

          {/* Network Info Card */}
          <div className="rounded-xl border   overflow-hidden">
            <div className="px-4 py-3 border-b ">
              <p className="text-xs font-medium  uppercase tracking-widest">Network</p>
            </div>
            <div className="divide-y divide-muted">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs">Driver</span>
                <span className="text-xs font-mono   px-2 py-0.5 rounded">
                  {network.driver}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs">Scope</span>
                <span className="text-xs font-mono   px-2 py-0.5 rounded">
                  {network.scope}
                </span>
              </div>
            </div>
          </div>

          {/* IPAM Card */}
          <div className="rounded-xl border   overflow-hidden">
            <div className="px-4 py-3 border-b  flex items-center justify-between">
              <p className="text-xs font-medium  uppercase tracking-widest">IPAM</p>
              <span className="text-xs font-mono  px-2 py-0.5 rounded">
                {network.ipam?.Driver ?? "N/A"}
              </span>
            </div>

            {network.ipam?.Config?.length ? (
              <div className="divide-y divide-zinc-800">
                {network.ipam.Config.map((cfg, i) => (
                  <div key={i} className="px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Subnet</span>
                      <span className="text-xs font-mono text-emerald-400">{cfg.Subnet}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Gateway</span>
                      <span className="text-xs font-mono text-zinc-300">{cfg.Gateway}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-5 text-center">
                <p className="text-xs ">Sem configuração IPAM</p>
              </div>
            )}
          </div>

        </aside>
      </div>
    </Tabs>
  );
}