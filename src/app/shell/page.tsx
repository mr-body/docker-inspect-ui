"use client"

import HeaderApp from "@/components/layout/header";
import { useEffect, useRef } from "react";

export default function TerminalPane() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let term: any;
        let fit: any;
        let ws: WebSocket | null = null;
        let disposed = false;

        (async () => {
            const { Terminal } = await import("xterm");
            const { FitAddon } = await import("xterm-addon-fit");
            await import("xterm/css/xterm.css");
            if (disposed || !ref.current) return;

            const WS_BASE = process.env.NEXT_PUBLIC_WS_SERVER || "ws://localhost:8000";

            term = new Terminal({ cursorBlink: true, fontSize: 13, theme: { background: "#000" } });
            fit = new FitAddon();
            term.loadAddon(fit);
            term.open(ref.current);
            fit.fit();

            ws = new WebSocket(`${WS_BASE}/terminal/local`);
            ws.onopen = () => {
                term.write(`\r\x1b[32m● Shell local aberto\x1b[0m\r\n`);
            };
            ws.onmessage = (e) => term.write(typeof e.data === "string" ? e.data : "");
            ws.onclose = () => {
                term.write("\r\x1b[31m● Conexão fechada\x1b[0m\r\n");
            };
            term.onData((d: string) => ws?.readyState === 1 && ws.send(d));

            const onResize = () => fit.fit();
            window.addEventListener("resize", onResize);
            (term as any)._cleanup = () => window.removeEventListener("resize", onResize);
        })();

        return () => {
            disposed = true;
            try {
                (term as any)?._cleanup?.();
                ws?.close();
                term?.dispose();
            } catch { }
        };
    }, []);

    return (
        <div className="flex h-screen flex-col">
            <header className="border-b bg-sidebar">
                <HeaderApp />
            </header>
            <div ref={ref} className="flex-1 overflow-hidden bg-black p-2" />
        </div>
    );
}
