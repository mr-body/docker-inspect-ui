"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, RotateCcw, Copy, X } from "lucide-react";
import { DockerNetworkContainer } from "@/types/network";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import StackIcon from "@/components/ui/stackI-con";

interface Props {
  containers: Record<string, DockerNetworkContainer>;
  gatewayIp?: string;
}

type Pt = { x: number; y: number };

const VIEW_W = 680;
const VIEW_H = 460;
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 4;

export function NetworkDiagram({ containers, gatewayIp = "172.18.0.1" }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const list = useMemo(() => Object.values(containers), [containers]);

  const cx = VIEW_W / 2;
  const cy = VIEW_H / 2;
  const radius = 180;

  const keyOf = (c: DockerNetworkContainer) => c.EndpointID ?? c.Name;

  const initialPositions = useMemo<Record<string, Pt>>(() => {
    const map: Record<string, Pt> = {};
    list.forEach((c, i) => {
      const a = (2 * Math.PI * i) / Math.max(list.length, 1) - Math.PI / 2;
      map[keyOf(c)] = { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
    });
    return map;
  }, [list]);

  const [positions, setPositions] = useState<Record<string, Pt>>(initialPositions);
  useEffect(() => setPositions(initialPositions), [initialPositions]);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Pt>({ x: 0, y: 0 });
  const [selected, setSelected] = useState<string | null>(null);

  const dragRef = useRef<
    | { type: "pan"; startX: number; startY: number; origin: Pt }
    | { type: "node"; key: string; offset: Pt }
    | null
  >(null);

  const toWorld = useCallback(
    (clientX: number, clientY: number): Pt => {
      const svg = svgRef.current!;
      const rect = svg.getBoundingClientRect();
      const sx = ((clientX - rect.left) / rect.width) * VIEW_W;
      const sy = ((clientY - rect.top) / rect.height) * VIEW_H;
      return { x: (sx - pan.x) / zoom, y: (sy - pan.y) / zoom };
    },
    [pan, zoom],
  );

  const onPointerDownBg = (e: React.PointerEvent) => {
    if ((e.target as Element).closest("[data-node]")) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    dragRef.current = { type: "pan", startX: e.clientX, startY: e.clientY, origin: pan };
  };

  const onPointerDownNode = (e: React.PointerEvent, key: string) => {
    e.stopPropagation();
    if (e.button === 2) return;
    (svgRef.current as unknown as Element)?.setPointerCapture?.(e.pointerId);
    const p = toWorld(e.clientX, e.clientY);
    const cur = positions[key];
    dragRef.current = { type: "node", key, offset: { x: p.x - cur.x, y: p.y - cur.y } };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    if (d.type === "pan") {
      const rect = svgRef.current!.getBoundingClientRect();
      const dx = ((e.clientX - d.startX) / rect.width) * VIEW_W;
      const dy = ((e.clientY - d.startY) / rect.height) * VIEW_H;
      setPan({ x: d.origin.x + dx, y: d.origin.y + dy });
    } else {
      const p = toWorld(e.clientX, e.clientY);
      setPositions((prev) => ({
        ...prev,
        [d.key]: { x: p.x - d.offset.x, y: p.y - d.offset.y },
      }));
    }
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * VIEW_W;
    const sy = ((e.clientY - rect.top) / rect.height) * VIEW_H;
    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * factor));
    const wx = (sx - pan.x) / zoom;
    const wy = (sy - pan.y) / zoom;
    setPan({ x: sx - wx * newZoom, y: sy - wy * newZoom });
    setZoom(newZoom);
  };

  const reset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setPositions(initialPositions);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(MAX_ZOOM, z * 1.1));
      else if (e.key === "-") setZoom((z) => Math.max(MIN_ZOOM, z / 1.1));
      else if (e.key === "0") reset();
      else if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPositions]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado`);
  };

  const curve = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    // arc up away from gateway
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const bend = 40;
    return `M ${x1} ${y1} Q ${mx + nx * bend} ${my + ny * bend} ${x2} ${y2}`;
  };

  const selectedContainer = selected
    ? list.find((c) => keyOf(c) === selected) ?? null
    : null;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl border border-border bg-card">
      {/* Toolbar */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-lg border border-border bg-background/80 p-1 backdrop-blur">
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z / 1.1))}>
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="min-w-10 text-center font-mono text-xs text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z * 1.1))}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
        <div className="mx-1 h-4 w-px bg-border" />
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={reset} title="Reset">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Hints */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><Kbd>scroll</Kbd> zoom</span>
        <span className="flex items-center gap-1"><Kbd>drag</Kbd> mover</span>
        <span className="flex items-center gap-1"><Kbd>+</Kbd><Kbd>-</Kbd><Kbd>0</Kbd></span>
        <span className="flex items-center gap-1"><Kbd>right-click</Kbd> ações</span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="block h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
        onPointerDown={onPointerDownBg}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onContextMenu={(e) => e.preventDefault()}
      >
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" opacity="0.45" />
          </pattern>
          <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" className="text-primary" stopOpacity="0.15" />
            <stop offset="100%" stopColor="currentColor" className="text-primary" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" className="text-primary" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" className="text-primary" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={VIEW_W} height={VIEW_H} fill="url(#grid)" />
        <rect width={VIEW_W} height={VIEW_H} fill="url(#bgGlow)" />

        <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
          {/* edges */}
          {list.map((c) => {
            const k = keyOf(c);
            const p = positions[k];
            if (!p) return null;
            const d = curve(cx, cy, p.x, p.y);
            return (
              <g key={`e-${k}`}>
                <path d={d} fill="none" stroke="currentColor" className="text-border" strokeWidth={1.5 / zoom} />
                <path
                  d={d}
                  fill="none"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth={2 / zoom}
                  strokeDasharray="4 10"
                  strokeLinecap="round"
                  opacity={0.85}
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1.4s" repeatCount="indefinite" />
                </path>
              </g>
            );
          })}

          {/* gateway */}
          <g>
            <circle cx={cx} cy={cy} r={56} fill="url(#nodeGlow)" />
            <circle cx={cx} cy={cy} r={38} className="fill-primary stroke-primary/40" strokeWidth={6 / zoom}>
              <animate attributeName="r" values="38;41;38" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <text x={cx} y={cy - 2} textAnchor="middle" className="fill-primary-foreground text-[11px] font-semibold">
              bridge
            </text>
            <text x={cx} y={cy + 11} textAnchor="middle" className="fill-primary-foreground text-[8px] font-mono opacity-80">
              {gatewayIp}
            </text>
          </g>

          {/* nodes */}
          {list.map((c) => {
            const k = keyOf(c);
            const p = positions[k];
            if (!p) return null;
            const isSel = selected === k;
            const ip = c.IPv4Address?.split("/")[0] ?? "—";
            const name = c.Name.length > 14 ? c.Name.slice(0, 13) + "…" : c.Name;
            return (
              <ContextMenu key={k}>
                <ContextMenuTrigger asChild>
                  <g
                    data-node
                    transform={`translate(${p.x} ${p.y})`}
                    onPointerDown={(e) => onPointerDownNode(e, k)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(k);
                    }}
                    className="cursor-grab active:cursor-grabbing relative select-none"
                  >
                    {/* glow */}
                    <circle r={44} fill="url(#nodeGlow)" opacity={isSel ? 1 : 0.6} />
                    {/* card */}
                    <rect
                      x={-44}
                      y={-26}
                      width={88}
                      height={52}
                      rx={10}
                      className={
                        isSel
                          ? "fill-accent stroke-primary"
                          : "fill-secondary stroke-border"
                      }
                      strokeWidth={isSel ? 2 / zoom : 1 / zoom}
                    />
                    {/* status dot */}
                    <circle cx={36} cy={-18} r={3.5} className="fill-emerald-500">
                      <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
                    </circle>

                    <foreignObject
                      x={22}
                      y={6}
                      width={24}
                      height={24}
                    >
                      <div className="flex items-center justify-center w-full h-full">
                        <StackIcon name={name} className="w-3 h-3" />
                      </div>
                    </foreignObject>
                    <text textAnchor="middle" y={-4} className="pointer-events-none fill-foreground text-[10px] font-semibold">
                      {name}
                    </text>
                    <text textAnchor="middle" y={12} className="pointer-events-none fill-muted-foreground text-[8px] font-mono">
                      {ip}
                    </text>
                  </g>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-52">
                  <ContextMenuItem onClick={() => setSelected(k)}>Ver detalhes</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => copy(c.Name, "Nome")}>
                    <Copy className="mr-2 h-3.5 w-3.5" /> Copiar nome
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => copy(ip, "IP")}>
                    <Copy className="mr-2 h-3.5 w-3.5" /> Copiar IP
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    onClick={() => setPositions((prev) => ({ ...prev, [k]: initialPositions[k] }))}
                  >
                    Restaurar posição
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </g>
      </svg>

      {/* Details panel */}
      {selectedContainer && (
        <div className="absolute right-3 top-14 z-10 w-64 rounded-lg border border-border bg-background/95 p-3 shadow-lg backdrop-blur">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <div className="text-xs font-semibold text-foreground">{selectedContainer.Name}</div>
              <div className="text-[10px] text-muted-foreground">Container</div>
            </div>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setSelected(null)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          <dl className="space-y-1.5 text-[11px]">
            <Row label="IPv4" value={selectedContainer.IPv4Address?.split("/")[0] ?? "—"} />
            <Row label="MAC" value={selectedContainer.MacAddress ?? "—"} />
            <Row label="Endpoint" value={selectedContainer.EndpointID?.slice(0, 12) ?? "—"} />
            <Row label="Gateway" value={gatewayIp} />
          </dl>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate font-mono text-foreground">{value}</dd>
    </div>
  );
}
