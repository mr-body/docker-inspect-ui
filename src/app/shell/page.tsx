"use client"

import HeaderApp from "@/components/layout/header";
import { Environment } from "@/service/environment";
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

            const env = await Environment()
            const WS_BASE = env.WS_SERVER || "ws://localhost:8000";

            term = new Terminal({ cursorBlink: true, fontSize: 13, theme: { background: "#000" } });
            fit = new FitAddon();
            term.loadAddon(fit);
            term.open(ref.current);
            fit.fit();

            ws = new WebSocket(`${WS_BASE}/terminal/local`);
            ws.onopen = () => {
                term.write("\r\n");

                // Status
                term.write("\x1b[32m● Shell Local Conectado\x1b[0m\r\n");
                term.write("\x1b[90m──────────────────────────────────────────────────────────────\x1b[0m\r\n\r\n");

                // Logo
                term.write("\x1b[36m");
                term.write("M\"\"\"\"\"\"'YMM    oo                                                dP\r\n");
                term.write("M  mmmm. `M                                                      88\r\n");
                term.write("M  MMMMM  M    dP 88d888b. .d8888b. 88d888b. .d8888b. .d8888b.d8888P\r\n");
                term.write("M  MMMMM  M    88 88'  `88 Y8ooooo. 88'  `88 88ooood8 88'  `\"\"   88\r\n");
                term.write("M  MMMM' .M    88 88    88       88 88.  .88 88.  ... 88.  ...   88\r\n");
                term.write("M       .MM    dP dP    dP `88888P' 88Y888P' `88888P' `88888P'   dP\r\n");
                term.write("MMMMMMMMMMM                         88\r\n");
                term.write("                                    dP\r\n");
                term.write("\x1b[0m\r\n");

                // Informações
                term.write("\x1b[33mDocker Inspect Terminal\x1b[0m\r\n");
                term.write("\x1b[90mDigite 'help' para listar os comandos disponíveis.\x1b[0m\r\n");
                term.write("\x1b[90mPressione Ctrl+C para interromper um processo.\x1b[0m\r\n\r\n");

                // Prompt inicial
                term.write("\x1b[32m$\x1b[0m ");
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
