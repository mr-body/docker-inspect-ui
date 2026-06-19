"use client"

import { useState } from "react";
import { toast } from "sonner";
import { Power, RotateCw, TerminalSquare, ScrollText, Loader2, RefreshCw } from "lucide-react";
import { useProcesses, useProcessStop, useProcessRestart } from "@/hooks/useProcessApi";
import { PageHeader, Card } from "@/components/DataPanel";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import StackIcon from "@/components/ui/stackI-con";
import { Badge } from "@/components/ui/badge";
import TerminalPane from "@/features/terminal";
import dynamic from "next/dynamic";
import { containerId, containerLabel } from "@/lib/utils";

type ActionKind = "stop" | "restart";

const LogsPane = dynamic(
  () => import("@/features/logs").then((mod) => mod.LogsPane),
  { ssr: false }
);

export default function ProcessesPage() {
  const { data, isLoading, refetch, isFetching } = useProcesses();

  const [confirm, setConfirm] = useState<{ kind: ActionKind; id: string; name: string } | null>(null);
  const [terminalFor, setTerminalFor] = useState<string | null>(null);
  const [logsFor, setLogsFor] = useState<string | null>(null);

  const stopMutation = useProcessStop();
  const restartMutation = useProcessRestart();

  const handleAction = () => {
    if (!confirm) return;
    const isStop = confirm.kind === "stop";
    const mutator = isStop ? stopMutation : restartMutation;

    mutator.mutate(confirm.id, {
      onSuccess: () => {
        toast.success(isStop ? "Container parado" : "Container reiniciado");
        setConfirm(null);
      },
      onError: (e: Error) => {
        toast.error(e.message);
        setConfirm(null);
      }
    });
  };

  const isPending = stopMutation.isPending || restartMutation.isPending;

  const list = (data) ?? [];

  return (
    <div>
      <PageHeader
        title="Processos"
        description="Containers em execução. Use as ações da linha para gerenciar."
        action={
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        }
      />

      {isLoading && <div className="text-sm text-muted-foreground">Carregando…</div>}

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Img</th>
              <th className="px-4 py-3" >Nome</th>
              <th className="px-4 py-3">Imagem</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ports</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c, i) => {
              const id = containerId(c);
              const name = containerLabel(c);
              const ports = c.ports
                ? c.ports
                  .split(",")
                  .map((x) => x.trim())
                : [];

              const visiblePorts = ports.slice(0, 2);

              const remaining =
                ports.length - visiblePorts.length;

              return (
                <tr key={i} className="border-t border-border hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium"><StackIcon name={c.image} className="w-10 h-10" /></td>
                  <td className="px-4 py-3 font-medium flex flex-col items-left gap-2">
                    <span>{name}</span>
                    {c.status.toLowerCase().includes("healthy") && (
                      <Badge
                        variant="default"
                        className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20"
                      >
                        healthy
                      </Badge>
                    )}
                    {c.status.toLowerCase().includes("unhealthy") && (
                      <Badge
                        variant="destructive"
                        className="animate-pulse"
                      >
                        unhealthy
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.image || c.image}</td>
                  <td className="px-4 py-3 w-35">
                    <span className="inline-flex  items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 text-xs" />
                      {c.running_for || c.status || "running"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {ports.slice(0, 2).map((port, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="font-mono"
                      >
                        {port}
                      </Badge>
                    ))}
                    {ports.length > 2 && (
                      <Badge
                        variant="outline"
                        className="font-mono "
                      >
                        +{ports.length - 2}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirm({ kind: "stop", id, name })}
                      >
                        <Power className="h-3.5 w-3.5" /> Down
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirm({ kind: "restart", id, name })}
                      >
                        <RotateCw className="h-3.5 w-3.5" /> Restart
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setTerminalFor(id)}>
                        <TerminalSquare className="h-3.5 w-3.5" /> Terminal
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setLogsFor(id)}>
                        <ScrollText className="h-3.5 w-3.5" /> Logs
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!isLoading && list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Sem containers ativos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Confirm dialog */}
      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.kind === "stop" ? "Parar container?" : "Reiniciar container?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.kind === "stop"
                ? `O container "${confirm?.name}" será parado.`
                : `O container "${confirm?.name}" será reiniciado.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={handleAction}
            >
              {isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Terminal sidebar */}
      <Sheet open={!!terminalFor} onOpenChange={(o) => !o && setTerminalFor(null)}>
        <SheetContent side="right" className="w-full p-0 data-[side=right]:sm:max-w-1/2 gap-0">
          <SheetHeader className="border-b border-border px-4 py-3">
            <SheetTitle className="text-sm">Terminal — {terminalFor}</SheetTitle>
            <SheetDescription className="text-xs">
              Shell interativo via WebSocket.
            </SheetDescription>
          </SheetHeader>
          {terminalFor && <TerminalPane container={terminalFor} />}
        </SheetContent>
      </Sheet>

      {/* Logs sheet */}
      <Sheet open={!!logsFor} onOpenChange={(o) => !o && setLogsFor(null)}>
        <SheetContent side="right" className="w-full p-0 data-[side=right]:sm:max-w-1/2 gap-0">
          <SheetHeader className="border-b border-border px-4 py-3 m-0">
            <SheetTitle className="text-sm">Logs — {logsFor}</SheetTitle>
            <SheetDescription className="text-xs">Stream em tempo real.</SheetDescription>
          </SheetHeader>
          {logsFor && <LogsPane identifier={logsFor} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}


