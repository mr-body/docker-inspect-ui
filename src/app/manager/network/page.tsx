"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Plug, PlugZap, Loader2, ArrowUpRight } from "lucide-react";

import { api } from "@/lib/docker-api";
import { PageHeader, Card } from "@/components/DataPanel";
import { Button } from "@/components/ui/button";
import { ContainerSelect } from "@/components/ContainerSelect";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import Link from "next/link";

type ConnKind = "connect" | "disconnect";

export default function Networks() {
    const qc = useQueryClient();
    const { data, isLoading } = useQuery({ queryKey: ["networks"], queryFn: api.networks });
    const [confirmDel, setConfirmDel] = useState<{ id: string; name: string } | null>(null);
    const [conn, setConn] = useState<{ kind: ConnKind; id: string; name: string } | null>(null);
    const [container, setContainer] = useState("");

    const remove = useMutation({
        mutationFn: (id: string) => api.networkRemove(id),
        onSuccess: () => {
            toast.success("Rede removida");
            qc.invalidateQueries({ queryKey: ["networks"] });
        },
        onError: (e: Error) => toast.error(e.message),
        onSettled: () => setConfirmDel(null),
    });

    const connect = useMutation({
        mutationFn: () =>
            conn!.kind === "connect"
                ? api.networkConnect(conn!.id, container)
                : api.networkDisconnect(conn!.id, container),
        onSuccess: () => {
            toast.success(conn?.kind === "connect" ? "Container conectado" : "Container desconectado");
            qc.invalidateQueries({ queryKey: ["networks"] });
            setConn(null);
            setContainer("");
        },
        onError: (e: Error) => toast.error(e.message),
    });

    return (
        <div>
            <PageHeader title="Networks" description="Redes Docker configuradas." />
            {isLoading && <div className="text-sm text-muted-foreground">Carregando…</div>}
            <Card className="overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3">Nome</th>
                            <th className="px-4 py-3">Driver</th>
                            <th className="px-4 py-3">Scope</th>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data as any[] | undefined)?.map((n, i) => {
                            const id = n.Id || n.id;
                            const name = n.Name || n.name;
                            return (
                                <tr key={i} className="border-t border-border hover:bg-secondary/30">
                                    <td >
                                        <Link href={`/manager/network/${id}`} className="px-4 py-3 font-medium flex gap-2 items-center">
                                            <Button variant={"outline"} size={"icon"}>
                                                <ArrowUpRight />
                                            </Button>
                                            {name}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{n.Driver || n.driver}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{n.Scope || n.scope}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{id?.slice(0, 12)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1.5">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setConn({ kind: "connect", id, name })}
                                            >
                                                <PlugZap className="h-3.5 w-3.5" /> Conectar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setConn({ kind: "disconnect", id, name })}
                                            >
                                                <Plug className="h-3.5 w-3.5" /> Desconectar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setConfirmDel({ id, name })}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-destructive" /> Down
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Card>

            <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover rede?</AlertDialogTitle>
                        <AlertDialogDescription>
                            A rede <span className="font-mono">{confirmDel?.name}</span> será removida.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={remove.isPending}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={remove.isPending}
                            onClick={() => confirmDel && remove.mutate(confirmDel.id)}
                        >
                            {remove.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                            Remover
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={!!conn} onOpenChange={(o) => !o && setConn(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {conn?.kind === "connect" ? "Conectar container" : "Desconectar container"}
                        </DialogTitle>
                        <DialogDescription>
                            Rede: <span className="font-mono">{conn?.name}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <label className="text-sm">Container</label>
                        <ContainerSelect value={container} onChange={setContainer} className="w-full" />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConn(null)} disabled={connect.isPending}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => connect.mutate()}
                            disabled={!container || connect.isPending}
                        >
                            {connect.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                            {conn?.kind === "connect" ? "Conectar" : "Desconectar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
