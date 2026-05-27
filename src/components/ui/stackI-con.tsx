import { cn, getStackIcon } from "@/lib/utils";

interface StackIconProps {
    name: string;
    className?: string;
}

export default function StackIcon({ name, className }: StackIconProps) {
    const Icon = getStackIcon(name);

    return <Icon className={cn("w-30 h-30", className)} />;
}