"use client"

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File as FileIcon,
  Download,
} from "lucide-react";
import { PageHeader, Card, JsonView } from "@/components/DataPanel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useVolume, useVolumeFiles } from "@/hooks/useVolumeApi";

type Node = { name: string; path: string; isDir: boolean; size?: number };

function normalize(raw: any): Node[] {
  const arr: any[] = Array.isArray(raw) ? raw : raw?.files || raw?.entries || raw?.items || [];
  return arr.map((f) => {
    if (typeof f === "string") {
      const isDir = f.endsWith("/");
      const name = f.replace(/\/$/, "").split("/").pop() || f;
      return { name, path: f, isDir };
    }
    const name = f.name || f.Name || f.path?.split("/").pop() || "?";
    const path = f.path || f.Path || name;
    const isDir = !!(f.is_dir ?? f.isDir ?? f.directory ?? f.type === "dir");
    return { name, path, isDir, size: f.size ?? f.Size };
  });
}

export default function VolumeDetail({ name }: { name: string }) {
  const info = useVolume(name);

  return (
    <div>
      <Link
        href="/manager/volume"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Volumes
      </Link>
      <PageHeader
        title={name}
        description="Detalhes do volume e navegador de arquivos."
        action={
          <Button asChild variant="outline" size="sm">
            <a href={"https://localhost:3001/volume/"
              + name
              + "/backup?"
              + new URLSearchParams({
                token: "dsodsoydodyso"
              })} target="_blank" rel="noreferrer">
              <Download className="h-3.5 w-3.5" /> Baixar backup
            </a>
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Inspect
          </h2>
          {info.data && <JsonView data={info.data} />}
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Explorer
          </h2>
          <Card className="overflow-hidden">
            <FileExplorer volume={name} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function FileExplorer({ volume }: { volume: string }) {
  return (
    <div className="max-h-[70vh] overflow-auto p-2 font-mono text-xs">
      <DirNode volume={volume} path="/" name={volume} defaultOpen />
    </div>
  );
}

function DirNode({
  volume,
  path,
  name,
  defaultOpen = false,
  depth = 0,
}: {
  volume: string;
  path: string;
  name: string;
  defaultOpen?: boolean;
  depth?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const q = useVolumeFiles(volume, path);

  const nodes = useMemo(() => normalize(q.data), [q.data]);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1 rounded px-1 py-0.5 hover:bg-secondary/60"
        style={{ paddingLeft: depth * 12 + 4 }}
      >
        {open ? (
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        )}
        {open ? (
          <FolderOpen className="h-3.5 w-3.5 text-amber-500" />
        ) : (
          <Folder className="h-3.5 w-3.5 text-amber-500" />
        )}
        <span className="truncate">{name}</span>
      </button>
      {open && (
        <div>
          {q.isLoading && (
            <div className="px-2 py-1 text-muted-foreground" style={{ paddingLeft: (depth + 1) * 12 + 8 }}>
              Carregando…
            </div>
          )}
          {q.isError && (
            <div className="px-2 py-1 text-destructive" style={{ paddingLeft: (depth + 1) * 12 + 8 }}>
              Erro ao listar
            </div>
          )}
          {nodes.map((n) =>
            n.isDir ? (
              <DirNode
                key={n.path}
                volume={volume}
                path={n.path.startsWith("/") ? n.path : `${path.replace(/\/$/, "")}/${n.name}`}
                name={n.name}
                depth={depth + 1}
              />
            ) : (
              <div
                key={n.path}
                className="flex items-center gap-1 rounded px-1 py-0.5 hover:bg-secondary/60"
                style={{ paddingLeft: (depth + 1) * 12 + 12 }}
              >
                <FileIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">{n.name}</span>
                {typeof n.size === "number" && (
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {n.size < 1024 ? `${n.size}B` : `${(n.size / 1024).toFixed(1)}KB`}
                  </span>
                )}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
