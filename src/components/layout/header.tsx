import DockerInspectIcon from "@/assets/icon";
import { div } from "framer-motion/client";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import { Tabs } from "../ui/vercel-tabs";
import { Button } from "../ui/button";
import { GrDocument } from "react-icons/gr";
import {
    HelpCircle,
    User,
} from "lucide-react";
import { NavUser } from "../ui/nav-user";
import { ModeToggle } from "../ui/mode-toggle";

export default function HeaderApp() {
    return (
        <header className="flex flex-col container m-auto max-w-6xl px-4">
            <div className="flex justify-between items-center h-20">
                <div className="flex items-center gap-3">
                    <DockerInspectIcon className="fill-foreground w-8 h-8" />
                    <h1 className="text-xl font-bold">Docker Inspect</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="">
                        <Button size={'icon'} variant={"outline"} className="rounded-full">
                            <HelpCircle size={30} />
                        </Button>
                    </Link>
                    <ModeToggle />
                    <NavUser />
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="h-12 flex items-center gap-4">
                    <Tabs />
                </div>
                <div className="flex gap-2">
                    <Link href="" className="flex items-center gap-2">
                        <Button variant={"outline"}>
                            <SiGithub size={15} />
                            Github
                        </Button>
                    </Link>
                    <Link href="" className="flex items-center gap-2">
                        <Button variant={"outline"}>
                            <GrDocument size={15} />
                            Doc
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}