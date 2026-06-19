"use client"

import { useEffect, useRef } from "react";
const { Terminal } = await import("xterm");
const { FitAddon } = await import("xterm-addon-fit");
import("xterm/css/xterm.css");

export function LogsPane({ identifier }: { identifier: string }) {
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new Terminal({
            cursorBlink: false,
            convertEol: true,
            disableStdin: true,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 12,
            theme: {
                background: "#000000",
            },
            scrollback: 10000,
        });

        const fitAddon = new FitAddon();

        term.loadAddon(fitAddon);
        term.open(terminalRef.current);

        setTimeout(() => fitAddon.fit(), 100);

        const ctrl = new AbortController();

        (async () => {
            try {

                const API_BASE = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:8000";

                const res = await fetch(
                    `${API_BASE}/log/stream?identifier=${encodeURIComponent(identifier)}`,
                    { signal: ctrl.signal }
                );

                if (!res.body) return;

                const reader = res.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { value, done } = await reader.read();

                    if (done) break;

                    term.write(
                        decoder.decode(value, {
                            stream: true,
                        })
                    );
                }
            } catch (err) {
                term.writeln("");
                term.writeln(`Erro: ${String(err)}`);
            }
        })();

        const resize = () => fitAddon.fit();

        window.addEventListener("resize", resize);

        return () => {
            ctrl.abort();
            window.removeEventListener("resize", resize);
            term.dispose();
        };
    }, [identifier]);

    return (
        <div
            ref={terminalRef}
            className="h-[calc(100vh-64px)] w-full"
        />
    );
}
