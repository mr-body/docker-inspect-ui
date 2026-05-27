import { div } from "framer-motion/client";
import { Folder, HelpCircle, Layers, Network, Server, User } from "lucide-react";
import Link from "next/link";
import { SiGithub } from "react-icons/si";

export default function HeaderApp() {
    return (
        <header className="flex flex-col container m-auto max-w-6xl px-4">
            <div className="flex justify-between items-center h-12">
                <h1 className="text-xl font-bold">Docker Inspect</h1>
                <div className="flex items-center gap-2">
                    <Link href="">
                        <HelpCircle size={20} />
                    </Link>
                    <Link href="">
                        <User size={20} />
                    </Link>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="h-12 flex items-center gap-4">
                    <Link href="/manager/image" className="btn flex items-center gap-2 nav-active">
                        <Layers size={15} />
                        Images
                    </Link>
                    <Link href="/manager/process" className="btn flex items-center gap-2">
                        <Server size={15} />
                        Process
                    </Link>
                    <Link href="/manager/network" className="btn flex items-center gap-2">
                        <Network size={15} />
                        Network
                    </Link>
                    <Link href="" className="btn flex items-center gap-2">
                        <Folder size={15} />
                        Volumes
                    </Link>
                </div>
                <div>
                    <Link href="" className="flex items-center gap-2">
                        <SiGithub size={15} />
                        Github
                    </Link>
                </div>
            </div>
        </header>
    )
}