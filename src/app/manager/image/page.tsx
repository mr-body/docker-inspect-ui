"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Play, Loader2 } from "lucide-react";

import { api } from "@/lib/docker-api";
import { PageHeader, Card, JsonView } from "@/components/DataPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import StackIcon from "@/components/ui/stackI-con";


export default function Images() {
    const qc = useQueryClient();
    const { data, isLoading } = useQuery({ queryKey: ["images"], queryFn: api.images });
    const [sel, setSel] = useState<any>(null);
    const [confirmDel, setConfirmDel] = useState<{ id: string; tag: string } | null>(null);
    const [runFor, setRunFor] = useState<{ image: string } | null>(null);

    const remove = useMutation({
        mutationFn: (id: string) => api.imageRemove(id),
        onSuccess: () => {
            toast.success("Imagem removida");
            qc.invalidateQueries({ queryKey: ["images"] });
        },
        onError: (e: Error) => toast.error(e.message),
        onSettled: () => setConfirmDel(null),
    });

    return (
        <div>
            <PageHeader title="Images" description="Imagens armazenadas localmente." />
            {isLoading && <div className="text-sm text-muted-foreground">Carregando…</div>}
            <Card className="overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3">Img</th>
                            <th className="px-4 py-3">Container</th>
                            <th className="px-4 py-3">Tag</th>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Tamanho</th>
                            <th className="px-4 py-3">Created</th>
                            <th className="px-4 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((img, i) => {
                            const tag = img.tag || "<none>";
                            const fullId = (img.id || img.id || "").replace(/^sha256:/, "");
                            const id = fullId.slice(0, 12);
                            const size = img.size || img.size || 0;
                            return (
                                <tr key={i} className="border-t border-border hover:bg-secondary/30">
                                    <td className="px-4 py-3 font-medium"><StackIcon name={img.repository} className="w-8 h-8" /></td>
                                    <td className="px-4 py-3 font-medium">{img.repository}</td>
                                    <td className="px-4 py-3 font-medium">{tag}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{id}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{size}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{img.created}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1.5">
                                            <Button size="sm" variant="outline" onClick={() => setRunFor({ image: tag !== "<none>" ? tag : fullId })}>
                                                <Play className="h-3.5 w-3.5" /> Run
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => setSel(img)}>
                                                Detalhes
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setConfirmDel({ id: fullId, tag })}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-destructive" /> Deletar
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
                        <AlertDialogTitle>Deletar imagem?</AlertDialogTitle>
                        <AlertDialogDescription>
                            A imagem <span className="font-mono">{confirmDel?.tag}</span> será removida do host.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={remove.isPending}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={remove.isPending}
                            onClick={() => confirmDel && remove.mutate(confirmDel.id)}
                        >
                            {remove.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                            Deletar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <RunDialog open={!!runFor} image={runFor?.image} onClose={() => setRunFor(null)} />
        </div>
    );
}

function RunDialog({
    open,
    image,
    onClose,
}: {
    open: boolean;
    image?: string;
    onClose: () => void;
}) {
    const qc = useQueryClient();
    const [name, setName] = useState("");
    const [ports, setPorts] = useState("");
    const [volumes, setVolumes] = useState("");

    const run = useMutation({
        mutationFn: () => api.imageRun({ image: image!, name, ports, volumes }),
        onSuccess: () => {
            toast.success("Container iniciado");
            qc.invalidateQueries({ queryKey: ["processes"] });
            onClose();
            setName("");
            setPorts("");
            setVolumes("");
        },
        onError: (e: Error) => toast.error(e.message),
    });

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Run image</DialogTitle>
                    <DialogDescription>
                        Iniciar container a partir de <span className="font-mono">{image}</span>.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="meu-container" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="ports">Portas</Label>
                        <Input id="ports" value={ports} onChange={(e) => setPorts(e.target.value)} placeholder="8080:80, 5432:5432" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="volumes">Volumes</Label>
                        <Input id="volumes" value={volumes} onChange={(e) => setVolumes(e.target.value)} placeholder="meuvol:/data" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={run.isPending}>
                        Cancelar
                    </Button>
                    <Button onClick={() => run.mutate()} disabled={!image || run.isPending}>
                        {run.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                        Iniciar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
