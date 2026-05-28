"use client"
import { useMemo, useRef, useState, useEffect } from "react";
import {
    Activity,
    Box,
    ChevronDown,
    Power,
    Search,
    Terminal as TerminalIcon,
    ScrollText,
    MoreHorizontal,
    Circle,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { DockerProcess } from "@/types/process";
import StackIcon from "@/components/ui/stackI-con";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";


const statusStyles: Record<DockerProcess["status"], string> = {
    running: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    paused: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    restarting: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    exited: "bg-muted text-muted-foreground border-border",
};


export function ProcessView({
    process,
}: {
    process: DockerProcess[];
}) {
    const [procs, setProcs] =
        useState<DockerProcess[]>(process);

    const [query, setQuery] = useState("");

    const [selected, setSelected] =
        useState<DockerProcess | null>(null);

    const filtered = useMemo(
        () =>
            procs.filter(
                (p) =>
                    p.name
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                    p.image
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                    p.id.includes(query),
            ),
        [procs, query],
    );

    const shutdown = (id: string) => {
        setProcs((prev) =>
            prev.map((p) =>
                p.id === id
                    ? {
                        ...p,
                        status: "exited",
                        running_for: "—",
                    }
                    : p,
            ),
        );

        toast.success("Container stopped");
        setSelected(null);
    };

    return (
        <div className="min-h-screen bg-sidebar">
            <Toaster richColors position="top-right" />

            <div className="mx-auto max-w-7xl px-6 py-10">
                {/* HEADER */}
                <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Box className="h-4 w-4" />
                            <span>Docker</span>
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight">
                            Processes
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {
                                procs.filter(
                                    (p) => p.status === "running",
                                ).length
                            }{" "}
                            running · {procs.length} total
                        </p>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={query}
                            onChange={(e) =>
                                setQuery(e.target.value)
                            }
                            placeholder="Search by name, image, id…"
                            className="pl-9"
                        />
                    </div>
                </header>

                {/* TABLE */}
                <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                    >
                        {filtered.map((p) => {
                            const ports = p.ports
                                ? p.ports
                                    .split(",")
                                    .map((x) => x.trim())
                                : [];

                            const visiblePorts = ports.slice(0, 2);

                            const remaining =
                                ports.length - visiblePorts.length;

                            return (
                                <AccordionItem
                                    key={p.id}
                                    value={p.id}
                                    className="border-b"
                                >
                                    <AccordionTrigger className="px-4 py-4 hover:no-underline">
                                        <div className="flex w-full items-center gap-4 text-left">
                                            {/* ICON */}
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-secondary">
                                                <StackIcon
                                                    name={p.image}
                                                    className="h-8 w-8"
                                                />
                                            </div>

                                            {/* INFO */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="truncate font-medium">
                                                        {p.name}
                                                    </span>

                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className={`gap-1.5 ${statusStyles[p.status]}`}
                                                        >
                                                            <Circle
                                                                className={`h-2 w-2 fill-current ${p.status.includes("Up")
                                                                        ? "animate-pulse"
                                                                        : ""
                                                                    }`}
                                                            />

                                                            {p.status}
                                                        </Badge>

                                                        {p.status.toLowerCase().includes("healthy") && (
                                                            <Badge
                                                                variant="default"
                                                                className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20"
                                                            >
                                                                healthy
                                                            </Badge>
                                                        )}

                                                        {p.status.toLowerCase().includes("unhealthy") && (
                                                            <Badge
                                                                variant="destructive"
                                                                className="animate-pulse"
                                                            >
                                                                unhealthy
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="font-mono">
                                                        {p.id.slice(0, 12)}
                                                    </span>

                                                    <span>•</span>

                                                    <span className="truncate font-mono">
                                                        {p.image}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* PORTS */}
                                            <div className="hidden md:flex flex-wrap items-center justify-end gap-2 max-w-[260px]">
                                                {visiblePorts.map(
                                                    (port, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="font-mono"
                                                        >
                                                            {port}
                                                        </Badge>
                                                    ),
                                                )}

                                                {remaining > 0 && (
                                                    <Badge
                                                        variant="outline"
                                                        className="font-medium"
                                                    >
                                                        +{remaining}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </AccordionTrigger>

                                    {/* DETAILS */}
                                    <AccordionContent className="px-4 pb-5">
                                        <div className="rounded-xl border bg-muted/30 p-5">
                                            <div className="grid gap-6 lg:grid-cols-3">
                                                {/* LEFT */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            Container
                                                        </p>

                                                        <p className="font-medium">
                                                            {p.name}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            Image
                                                        </p>

                                                        <p className="font-mono text-sm">
                                                            {p.image}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            Container ID
                                                        </p>

                                                        <p className="font-mono text-xs break-all">
                                                            {p.id}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* PORTS */}
                                                <div>
                                                    <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
                                                        Exposed Ports
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {ports.length > 0 ? (
                                                            ports.map(
                                                                (port, index) => (
                                                                    <Badge
                                                                        key={index}
                                                                        variant="secondary"
                                                                        className="font-mono"
                                                                    >
                                                                        {port}
                                                                    </Badge>
                                                                ),
                                                            )
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">
                                                                No ports exposed
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* ACTIONS */}
                                                <div>
                                                    <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
                                                        Actions
                                                    </p>

                                                    <div className="flex flex-wrap gap-3">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                setSelected(p)
                                                            }
                                                        >
                                                            Details
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                shutdown(p.id)
                                                            }
                                                            disabled={
                                                                p.status !== "running"
                                                            }
                                                        >
                                                            Stop
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>

                    {/* EMPTY */}
                    {filtered.length === 0 && (
                        <div className="py-16 text-center text-sm text-muted-foreground">
                            No containers match "{query}"
                        </div>
                    )}
                </div>
            </div>

            <ProcessSheet
                proc={selected}
                onClose={() => setSelected(null)}
                onShutdown={shutdown}
            />
        </div>
    );
}

function RowMenu({
    proc,
    onOpen,
    onShutdown,
}: {
    proc: DockerProcess;
    onOpen: () => void;
    onShutdown: () => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={onOpen}>
                    <ScrollText className="mr-2 h-4 w-4" /> View logs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onOpen}>
                    <TerminalIcon className="mr-2 h-4 w-4" /> Terminal
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={(e) => e.preventDefault()}
                        >
                            <Power className="mr-2 h-4 w-4" /> Shutdown
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Stop {proc.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will stop the container. You can start it again later.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={onShutdown}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Shutdown
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function ProcessSheet({
    proc,
    onClose,
    onShutdown,
}: {
    proc: DockerProcess | null;
    onClose: () => void;
    onShutdown: (id: string) => void;
}) {
    return (
        <Sheet open={!!proc} onOpenChange={(o) => !o && onClose()}>
            <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl">
                {proc && (
                    <>
                        <SheetHeader className="border-b px-6 py-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <SheetTitle className="flex items-center gap-2 truncate">
                                        <StackIcon name={proc.image} className="w-10 h-10" />
                                        {proc.name}
                                    </SheetTitle>
                                    <SheetDescription className="font-mono text-xs">
                                        {proc.id} · {proc.image}
                                    </SheetDescription>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" className="gap-1.5">
                                            <Power className="h-3.5 w-3.5" /> Shutdown
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Stop {proc.name}?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will stop the container immediately.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => onShutdown(proc.id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Shutdown
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </SheetHeader>

                        <Tabs defaultValue="logs" className="flex flex-1 flex-col overflow-hidden">
                            <div className="border-b px-6 pt-3">
                                <TabsList>
                                    <TabsTrigger value="logs" className="gap-1.5">
                                        <ScrollText className="h-3.5 w-3.5" /> Logs
                                    </TabsTrigger>
                                    <TabsTrigger value="terminal" className="gap-1.5">
                                        <TerminalIcon className="h-3.5 w-3.5" /> Terminal
                                    </TabsTrigger>
                                    <TabsTrigger value="info" className="gap-1.5">
                                        <ChevronDown className="h-3.5 w-3.5" /> Info
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="logs" className="flex-1 overflow-hidden p-0">
                                <LogStream procName={proc.name} />
                            </TabsContent>
                            <TabsContent value="terminal" className="flex-1 overflow-hidden p-0">
                                <Terminal procName={proc.name} />
                            </TabsContent>
                            <TabsContent value="info" className="flex-1 overflow-auto px-6 py-4">
                                <InfoGrid proc={proc} />
                            </TabsContent>
                        </Tabs>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}

function InfoGrid({ proc }: { proc: DockerProcess }) {
    const rows: [string, string][] = [
        ["Name", proc.name],
        ["Container ID", proc.id],
        ["Image", proc.image],
        ["Command", proc.command],
        ["Status", proc.status],
        ["Running for", proc.running_for],
        ["Ports", proc.ports || "—"],
    ];
    return (
        <dl className="divide-y rounded-lg border">
            {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-4 px-4 py-3 text-sm">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="col-span-2 break-all font-mono">{v}</dd>
                </div>
            ))}
        </dl>
    );
}

const SAMPLE_LOGS = [
    "[info] Listening on 0.0.0.0:3000",
    "[info] Connected to database",
    "[info] GET /api/health 200 4ms",
    "[info] GET /api/users 200 18ms",
    "[warn] slow query (212ms): SELECT * FROM orders",
    "[info] POST /api/login 200 42ms",
    "[info] Cache hit ratio: 94.2%",
    "[info] GET /api/products 200 11ms",
];

function LogStream({ procName }: { procName: string }) {
    const [lines, setLines] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLines([`$ docker logs -f ${procName}`]);
        let i = 0;
        const id = setInterval(() => {
            setLines((prev) => [
                ...prev,
                `${new Date().toLocaleTimeString()}  ${SAMPLE_LOGS[i % SAMPLE_LOGS.length]}`,
            ]);
            i++;
        }, 900);
        return () => clearInterval(id);
    }, [procName]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, [lines]);

    return (
        <div
            ref={scrollRef}
            className="h-full overflow-auto bg-zinc-950 px-4 py-3 font-mono text-xs leading-relaxed text-zinc-200"
        >
            {lines.map((l, i) => (
                <div key={i} className="whitespace-pre-wrap">
                    <span className={l.includes("[warn]") ? "text-amber-400" : l.includes("[error]") ? "text-red-400" : "text-zinc-300"}>
                        {l}
                    </span>
                </div>
            ))}
            <span className="inline-block h-3 w-1.5 animate-pulse bg-emerald-400 align-middle" />
        </div>
    );
}

function Terminal({ procName }: { procName: string }) {
    const [history, setHistory] = useState<{ cmd: string; out: string }[]>([
        { cmd: "", out: `Connected to ${procName}. Type 'help' for commands.` },
    ]);
    const [value, setValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const run = (cmd: string) => {
        const c = cmd.trim();
        if (!c) return;
        let out = "";
        if (c === "help") out = "Available: help, ls, whoami, uptime, clear";
        else if (c === "ls") out = "app  bin  etc  lib  tmp  usr  var";
        else if (c === "whoami") out = "root";
        else if (c === "uptime") out = "up 3 days, 4:21";
        else if (c === "clear") {
            setHistory([]);
            return;
        } else out = `sh: ${c}: command not found`;
        setHistory((h) => [...h, { cmd: c, out }]);
    };

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, [history]);

    return (
        <div className="flex h-full flex-col bg-zinc-950 font-mono text-xs text-zinc-100">
            <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-3">
                {history.map((h, i) => (
                    <div key={i} className="mb-1">
                        {h.cmd && (
                            <div>
                                <span className="text-emerald-400">root@{procName}:/#</span>{" "}
                                <span>{h.cmd}</span>
                            </div>
                        )}
                        {h.out && <div className="whitespace-pre-wrap text-zinc-300">{h.out}</div>}
                    </div>
                ))}
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    run(value);
                    setValue("");
                }}
                className="flex items-center gap-2 border-t border-zinc-800 bg-zinc-950 px-4 py-2"
            >
                <span className="text-emerald-400">root@{procName}:/#</span>
                <input
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="flex-1 bg-transparent outline-none placeholder:text-zinc-600"
                    placeholder="type a command…"
                />
            </form>
        </div>
    );
}
