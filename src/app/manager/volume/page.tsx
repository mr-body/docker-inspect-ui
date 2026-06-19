"use client"

import { useVolumes, useVolumeRemove } from "@/hooks/useVolumeApi";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, FolderOpen, Loader2 } from "lucide-react";

import { PageHeader, Card } from "@/components/DataPanel";
import { Button } from "@/components/ui/button";
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


export default function Volumes() {
  const { data, isLoading } = useVolumes();
  const list: any[] = Array.isArray(data) ? data : (data as any)?.Volumes || [];
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const remove = useVolumeRemove();

  const handleRemove = () => {
    if (!confirmDel) return;
    remove.mutate(confirmDel, {
      onSuccess: () => {
        toast.success("Volume removido");
        setConfirmDel(null);
      },
      onError: (e: Error) => {
        toast.error(e.message);
        setConfirmDel(null);
      }
    });
  };

  return (
    <div>
      <PageHeader title="Volumes" description="Volumes persistentes Docker." />
      {isLoading && <div className="text-sm text-muted-foreground">Carregando…</div>}
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Mountpoint</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((v, i) => {
              const name = v.Name || v.name;
              return (
                <tr key={i} className="border-t border-border hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.Driver || v.driver}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {v.Mountpoint || v.mountpoint}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/manager/volume/${name}`}>
                          <FolderOpen className="h-3.5 w-3.5" /> Open
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setConfirmDel(name)}>
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
            <AlertDialogTitle>Deletar volume?</AlertDialogTitle>
            <AlertDialogDescription>
              O volume <span className="font-mono">{confirmDel}</span> será removido. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={remove.isPending}
              onClick={handleRemove}
            >
              {remove.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
